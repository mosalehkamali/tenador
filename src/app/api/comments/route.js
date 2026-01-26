import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Comment from "base/models/Comment";

export async function GET(req) {
  try {
    await connectToDB();
    const comments = await Comment.find({}).populate('user product parent replies');
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { user, product, parent, text, rating } = body;

    if (!user || !product || !text) {
      return NextResponse.json({ error: "User, product, and text are required" }, { status: 400 });
    }

    const newComment = new Comment({
      user,
      product,
      parent,
      text: text.trim(),
      rating,
      approved: false // Default false, admin approval needed
    });

    await newComment.save();
    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
