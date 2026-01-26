import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Ban from "base/models/Ban";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const ban = await Ban.findById(id).populate('user bannedBy');
    if (!ban) {
      return NextResponse.json({ error: "Ban not found" }, { status: 404 });
    }
    return NextResponse.json({ ban });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { user, reason, bannedBy, banDuration, isActive } = body;

    // Validation
    if (!user || !reason || !bannedBy) {
      return NextResponse.json({ error: "User, reason, and bannedBy are required" }, { status: 400 });
    }

    const updatedBan = await Ban.findByIdAndUpdate(
      id,
      {
        user,
        reason: reason.trim(),
        bannedBy,
        banDuration: banDuration || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true }
    );

    if (!updatedBan) {
      return NextResponse.json({ error: "Ban not found" }, { status: 404 });
    }

    return NextResponse.json({ ban: updatedBan });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const deletedBan = await Ban.findByIdAndDelete(id);
    if (!deletedBan) {
      return NextResponse.json({ error: "Ban not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ban deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
