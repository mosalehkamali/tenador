import { NextResponse } from 'next/server';
import connectToDB from 'base/configs/db';
import Otp from 'base/models/Otp';

export async function POST(request) {
  try {
    await connectToDB();

    const { phone, code } = await request.json();

    // Validation
    if (!phone || !code) {
      return NextResponse.json({ message: 'Phone and code are required' }, { status: 400 });
    }

    // Find OTP
    const otp = await Otp.findOne({ phone, code });

    if (!otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    // Check expiration
    if (Date.now() > otp.expTime) {
      await Otp.deleteOne({ _id: otp._id });
      return NextResponse.json({ message: 'OTP expired' }, { status: 400 });
    }

    // Delete OTP after verification
    await Otp.deleteOne({ _id: otp._id });

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
