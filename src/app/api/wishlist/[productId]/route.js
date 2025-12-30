import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import User from "base/models/User";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { productId } = params;
    const userId = req.headers.get('user-id'); // Placeholder, replace with auth
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    return NextResponse.json({ message: "Product removed from wishlist" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
