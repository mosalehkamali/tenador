import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Comment from "base/models/Comment";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const comment = await Comment.findById(id).populate('user product parent replies');
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { text, rating, approved } = body;

    const updateData = {};
    if (text !== undefined) updateData.text = text.trim();
    if (rating !== undefined) updateData.rating = rating;
    if (approved !== undefined) updateData.approved = approved;

    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment: updatedComment });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
