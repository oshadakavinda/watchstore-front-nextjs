import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";
import mongoose from "mongoose";

export default async function handle(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  const userEmail = session.user.email;

  if (req.method === 'POST') {
    const {product} = req.body;

    if (!product || typeof product !== 'string' || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({error: 'Invalid product ID'});
    }

    const wishedDoc = await WishedProduct.findOne({userEmail, product});
    if (wishedDoc) {
      await WishedProduct.findByIdAndDelete(wishedDoc._id);
      res.json({wishedDoc});
    } else {
      await WishedProduct.create({userEmail, product});
      res.json('created');
    }
  }

  if (req.method === 'GET') {
    res.json(
      await WishedProduct.find({userEmail}).populate('product')
    );
  }
}