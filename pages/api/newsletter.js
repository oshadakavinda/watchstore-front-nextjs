import { mongooseConnect } from "@/lib/mongoose";
import { Subscriber } from "@/models/Subscriber";
import { applyRateLimit } from "@/lib/security";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (!applyRateLimit(req, res, { limit: 10, windowMs: 60 * 1000 })) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  const cleanEmail = email.toLowerCase().trim();

  await mongooseConnect();

  try {
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({
        success: true,
        message: 'Welcome back! You are already subscribed to our VIP collectors circle.',
      });
    }

    const subscriber = await Subscriber.create({
      email: cleanEmail,
      source: source || 'newsletter_signup',
    });

    return res.json({
      success: true,
      message: 'Thank you for joining the WatchStore Collectors Circle.',
      subscriber,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record subscription' });
  }
}
