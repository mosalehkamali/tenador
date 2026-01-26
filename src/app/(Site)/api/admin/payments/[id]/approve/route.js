import { verifyToken, isAdmin } from 'base/utils/auth.js';
import Payment from 'base/models/Payment.js';
import Order from 'base/models/Order.js';

export async function POST(req, { params }) {
  try {
    // Authentication and authorization
    if (!req.user || req.user.role !== 'ADMIN') {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find payment and order
    const payment = await Payment.findById(id).populate('order');
    if (!payment) {
      return Response.json({ message: 'Payment not found' }, { status: 404 });
    }

    const order = payment.order;
    if (payment.status !== 'PENDING' || order.paymentStatus !== 'UNDER_REVIEW') {
      return Response.json({ message: 'Invalid state for approval' }, { status: 400 });
    }

    // Use transaction
    const session = await Payment.startSession();
    session.startTransaction();
    try {
      payment.status = 'PAID';
      payment.meta = { ...payment.meta, approvedAt: new Date(), approvedBy: req.user._id };
      await payment.save({ session });

      order.paymentStatus = 'PAID';
      if (payment.method === 'BANK_RECEIPT') {
        order.fulfillmentStatus = 'PROCESSING';
      }
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return Response.json({ message: 'Payment approved' }, { status: 200 });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
