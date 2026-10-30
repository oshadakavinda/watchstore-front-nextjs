import { Order } from "@/models/Order";

let cleanupTimerStarted = false;

/**
 * Automatically marks unpaid orders older than 30 minutes as 'cancelled'.
 */
export async function cancelExpiredOrders() {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const result = await Order.updateMany(
      {
        paid: false,
        status: { $nin: ['cancelled'] },
        createdAt: { $lt: thirtyMinutesAgo },
      },
      {
        $set: { status: 'cancelled' },
      }
    );
    return result;
  } catch (error) {
    console.error("Failed to auto-cancel expired orders:", error);
    return null;
  }
}

/**
 * Initializes a recurring background timer (every 5 minutes) to cancel stale unpaid orders.
 */
export function initOrderCleanupTimer() {
  if (cleanupTimerStarted) return;
  cleanupTimerStarted = true;

  // Run initial pass
  cancelExpiredOrders().catch(() => {});

  // Run recurring pass every 5 minutes
  setInterval(() => {
    cancelExpiredOrders().catch(err => {
      console.error("Periodic order cleanup error:", err);
    });
  }, 5 * 60 * 1000);
}
