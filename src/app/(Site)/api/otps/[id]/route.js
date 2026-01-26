import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Otp from "base/models/Otp";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const otp = await Otp.findById(id);
    if (!otp) {
      return NextResponse.json({ error: "Otp not found" }, { status: 404 });
    }
    return NextResponse.json({ otp });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { phone, code, expTime, waitTime, useTimes } = body;

    // Validation
    if (!phone || !code || !expTime) {
      return NextResponse.json({ error: "Phone, code, and expTime are required" }, { status: 400 });
    }

    const updatedOtp = await Otp.findByIdAndUpdate(
      id,
      {
        phone,
        code,
        expTime,
        waitTime: waitTime || 0,
        useTimes: useTimes || 0
      },
      { new: true }
    );

    if (!updatedOtp) {
      return NextResponse.json({ error: "Otp not found" }, { status: 404 });
    }

    return NextResponse.json({ otp: updatedOtp });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const deletedOtp = await Otp.findByIdAndDelete(id);
    if (!deletedOtp) {
      return NextResponse.json({ error: "Otp not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Otp deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
