import { connectDB } from '../../../lib/db.js';
import Order from '../../../models/Order.js';
import Inventory from '../../../models/Inventory.js';
import mongoose from 'mongoose';
export async function POST(req){
  await connectDB();
  const body = await req.json();
  if (!body.items || !Array.isArray(body.items)) return new Response(JSON.stringify({ message: 'No items' }), { status: 400 });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const it of body.items) {
      const inv = await Inventory.findOne({ variant: it.variant }).session(session);
      if (!inv || inv.quantity < it.qty) throw { message: 'Insufficient stock', status: 400 };
      inv.quantity -= it.qty;
      await inv.save({ session });
    }
    const order = await Order.create([{
      user: body.user,
      items: body.items,
      total: body.total,
    }], { session });
    await session.commitTransaction();
    session.endSession();
    return new Response(JSON.stringify(order[0]), { status: 201 });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return new Response(JSON.stringify({ message: err.message || 'Error' }), { status: err.status || 500 });
  }
}
