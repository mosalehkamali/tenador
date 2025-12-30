import { verifyToken, isAdmin } from 'base/utils/auth.js';
import Installment from 'base/models/Installment.js';
import Payment from 'base/models/Payment.js';
import Order from 'base/models/Order.js';

export async function PATCH(req, { params }) {
  try {
    // Authentication and authorization
    if (!req.user || req.user.role !== 'ADMIN') {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { checkId } = params;
    const { status } = await req.json();

    if (!status || !['PENDING', 'CLEARED', 'REJECTED'].includes(status)) {
      return Response.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Find installment with check
    const installment = await Installment.findOne({ 'checks._id': checkId }).populate('order');
    if (!installment) {
      return Response.json({ message: 'Check not found' }, { status: 404 });
    }

    const check = installment.checks.id(checkId);
    if (!check) {
      return Response.json({ message: 'Check not found' }, { status: 404 });
    }

    // Update check status
    check.status = status;
    await installment.save();

    // Check if all checks are CLEARED
    const allCleared = installment.checks.every(c => c.status === 'CLEARED');
    if (allCleared) {
      // Find payment
      const payment = await Payment.findOne({ order: installment.order._id });
      const order = installment.order;

      // Use transaction
      const session = await Payment.startSession();
      session.startTransaction();
      try {
        payment.status = 'PAID';
        await payment.save({ session });

        order.paymentStatus = 'PAID';
        await order.save({ session });

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    }

    return Response.json({ message: 'Check status updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
