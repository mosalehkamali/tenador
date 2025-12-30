import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import User from "base/models/User";

export async function GET(req) {
  try {
    await connectToDB();
    // Assume user ID from auth, for now placeholder
    const userId = req.headers.get('user-id'); // Placeholder, replace with auth
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: "User ID and Product ID required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    return NextResponse.json({ message: "Product added to wishlist" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
