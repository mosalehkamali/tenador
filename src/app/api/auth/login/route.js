import { connectDB } from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import { signToken } from '../../../../utils/jwt.js';
export async function POST(req){
  await connectDB();
  const { email, password } = await req.json();
  const u = await User.findOne({ email });
  if (!u) return new Response(JSON.stringify({ message: 'Invalid' }), { status: 401 });
  const ok = await u.match(password);
  if (!ok) return new Response(JSON.stringify({ message: 'Invalid' }), { status: 401 });
  const token = signToken({ id: u._id });
  return new Response(JSON.stringify({ token, user: { id: u._id, email: u.email, name: u.name } }));
}
