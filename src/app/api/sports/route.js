import { connectDB } from '../../../lib/db.js';
import Sport from '../../../models/Sport.js';
export async function GET(){ await connectDB(); const list = await Sport.find().limit(100); return new Response(JSON.stringify(list)); }
export async function POST(req){ await connectDB(); const body = await req.json(); const s = await Sport.create(body); return new Response(JSON.stringify(s), { status: 201 }); }
