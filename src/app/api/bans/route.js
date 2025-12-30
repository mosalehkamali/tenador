import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Ban from "base/models/Ban";

export async function GET(req) {
  try {
    await connectToDB();
    const bans = await Ban.find({}).populate('user bannedBy');
    return NextResponse.json({ bans });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { user, reason, bannedBy, banDuration, isActive } = body;

    // Validation
    if (!user || !reason || !bannedBy) {
      return NextResponse.json({ error: "User, reason, and bannedBy are required" }, { status: 400 });
    }

    const newBan = new Ban({
      user,
      reason: reason.trim(),
      bannedBy,
      banDuration: banDuration || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await newBan.save();
    return NextResponse.json({ ban: newBan }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
