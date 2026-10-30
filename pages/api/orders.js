import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Order} from "@/models/Order";
import {cancelExpiredOrders, initOrderCleanupTimer} from "@/lib/orderCleanup";

export default async function handle(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed'});
  }

  await mongooseConnect();

  // Auto-cancel any unpaid orders older than 30 minutes
  initOrderCleanupTimer();
  await cancelExpiredOrders();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  const orders = await Order.find({
    $or: [
      { userEmail: session.user.email },
      { email: session.user.email },
    ]
  }).sort({ createdAt: -1 });

  res.json(orders);
}