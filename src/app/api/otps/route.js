import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Otp from "base/models/Otp";

export async function GET(req) {
  try {
    await connectToDB();
    const otps = await Otp.find({});
    return NextResponse.json({ otps });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { phone, code, expTime, waitTime, useTimes } = body;

    // Validation
    if (!phone || !code || !expTime) {
      return NextResponse.json({ error: "Phone, code, and expTime are required" }, { status: 400 });
    }

    const newOtp = new Otp({
      phone,
      code,
      expTime,
      waitTime: waitTime || 0,
      useTimes: useTimes || 0
    });

    await newOtp.save();
    return NextResponse.json({ otp: newOtp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
