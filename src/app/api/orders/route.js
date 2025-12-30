import { verifyToken } from 'base/utils/auth.js';
import Order from 'base/models/Order.js';
import Payment from 'base/models/Payment.js';
import Installment from 'base/models/Installment.js';

export async function POST(req) {
  try {
    // Authentication assumed via middleware
    if (!req.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, totalPrice, paymentMethod, address, description } = await req.json();

    // Validation
    if (!items || !totalPrice || !paymentMethod || !address) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (!['ONLINE', 'BANK_RECEIPT', 'INSTALLMENT'].includes(paymentMethod)) {
      return Response.json({ message: 'Invalid payment method' }, { status: 400 });
    }
    if (totalPrice <= 0) {
      return Response.json({ message: 'Invalid total price' }, { status: 400 });
    }

    // Create Order
    const order = new Order({
      user: req.user._id,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'WAITING',
      address,
      description,
    });
    await order.save();

    // Create Payment
    const payment = new Payment({
      order: order._id,
      method: paymentMethod,
      amount: totalPrice,
      status: 'PENDING',
    });
    await payment.save();

    // Handle INSTALLMENT
    if (paymentMethod === 'INSTALLMENT') {
      const installment = new Installment({
        order: order._id,
        checks: [],
      });
      await installment.save();
      // Set Order paymentStatus to UNDER_REVIEW
      order.paymentStatus = 'UNDER_REVIEW';
      await order.save();
    }

    return Response.json({ order, payment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
