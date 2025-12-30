import { verifyToken } from 'base/utils/auth.js';
import Payment from 'base/models/Payment.js';
import Order from 'base/models/Order.js';

export async function POST(req) {
  try {
    // Authentication
    if (!req.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, receiptUrl, receiptDetails } = await req.json();

    if (!paymentId || !receiptUrl) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find payment and order
    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment || payment.method !== 'BANK_RECEIPT') {
      return Response.json({ message: 'Invalid payment' }, { status: 400 });
    }

    const order = payment.order;
    if (order.user.toString() !== req.user._id.toString()) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }
    if (order.paymentStatus !== 'PENDING') {
      return Response.json({ message: 'Payment already processed' }, { status: 400 });
    }

    // Update payment meta with receipt
    payment.meta = { receiptUrl, receiptDetails, uploadedAt: new Date() };
    await payment.save();

    // Set statuses
    order.paymentStatus = 'UNDER_REVIEW';
    await order.save();

    return Response.json({ message: 'Receipt uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
