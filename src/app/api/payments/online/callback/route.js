import Payment from 'base/models/Payment.js';
import Order from 'base/models/Order.js';

export async function POST(req) {
  try {
    const { paymentId, status, transactionId } = await req.json();

    if (!paymentId || !status || !transactionId) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find payment and order
    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment || payment.method !== 'ONLINE') {
      return Response.json({ message: 'Invalid payment' }, { status: 400 });
    }

    const order = payment.order;
    if (order.paymentStatus !== 'PENDING') {
      return Response.json({ message: 'Payment already processed' }, { status: 400 });
    }

    // Verify payment with gateway (TODO: Integrate with actual payment gateway like Stripe, PayPal)
    // For now, assume status === 'success' means verified
    if (status !== 'success') {
      // Mark as FAILED
      payment.status = 'FAILED';
      order.paymentStatus = 'REJECTED';
      await payment.save();
      await order.save();
      return Response.json({ message: 'Payment failed' }, { status: 200 });
    }

    // Use transaction for atomicity
    const session = await Payment.startSession();
    session.startTransaction();
    try {
      payment.status = 'PAID';
      payment.meta = { transactionId, verifiedAt: new Date() };
      await payment.save({ session });

      order.paymentStatus = 'PAID';
      order.fulfillmentStatus = 'PROCESSING';
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return Response.json({ message: 'Payment successful' }, { status: 200 });
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
