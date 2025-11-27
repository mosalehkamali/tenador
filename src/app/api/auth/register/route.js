import { connectDB } from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import { signToken } from '../../../../utils/jwt.js';
export async function POST(req){
  await connectDB();
  const { name, email, password } = await req.json();
  const exist = await User.findOne({ email });
  if (exist) return new Response(JSON.stringify({ message: 'User exists' }), { status: 400 });
  const u = await User.create({ name, email, password });
  const token = signToken({ id: u._id });
  return new Response(JSON.stringify({ token, user: { id: u._id, email: u.email, name: u.name } }), { status: 201 });
}
