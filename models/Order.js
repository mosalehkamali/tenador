import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }, qty: Number, price: Number }],
  total: Number,
  status: { type: String, enum: ['pending','paid','shipped','completed','cancelled'], default: 'pending' },
}, { timestamps: true });
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
