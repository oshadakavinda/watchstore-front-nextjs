import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 500);
}

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    let sumRating = 0;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const r of reviews) {
      sumRating += r.rating;
      if (breakdown[r.rating] !== undefined) {
        breakdown[r.rating] += 1;
      }
    }

    const averageRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : 0;

    return res.json({
      reviews,
      totalReviews,
      averageRating: Number(averageRating),
      breakdown,
    });
  }

  if (req.method === 'POST') {
    const { productId, rating, title, content, userName, userEmail } = req.body;
    const session = await getServerSession(req, res, authOptions);

    const email = session?.user?.email || userEmail;
    const name = session?.user?.name || userName;

    if (!productId || !rating || !content || !email || !name) {
      return res.status(400).json({ error: 'Please provide all required review fields.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
    }

    // Check if user has an existing paid order containing this product
    const product = await Product.findById(productId);
    let verifiedPurchase = false;
    if (product) {
      const matchingOrder = await Order.findOne({
        userEmail: email,
        paid: true,
        'line_items.price_data.product_data.name': { $regex: new RegExp(product.title, 'i') },
      });
      if (matchingOrder) {
        verifiedPurchase = true;
      }
    }

    const review = await Review.create({
      productId,
      userEmail: email.toLowerCase().trim(),
      userName: sanitize(name),
      rating: numRating,
      title: sanitize(title || ''),
      content: sanitize(content),
      verifiedPurchase,
    });

    return res.json(review);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
