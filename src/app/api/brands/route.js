import { connectDB } from '../../../lib/db.js';
import Brand from '../../../models/Brand.js';
export async function GET(){ await connectDB(); const list = await Brand.find().limit(100); return new Response(JSON.stringify(list)); }
export async function POST(req){ await connectDB(); const body = await req.json(); const b = await Brand.create(body); return new Response(JSON.stringify(b), { status: 201 }); }
