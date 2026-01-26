import { NextResponse } from 'next/server';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import Otp from 'base/models/Otp';
import { validatePhone } from 'base/utils/auth';

export async function POST(request) {
  try {
    await connectToDB();

    const { phone } = await request.json();

    // Validation
    if (!phone) {
      return NextResponse.json({ message: 'Phone is required' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expTime = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Save OTP
    const otp = new Otp({
      phone,
      code: otpCode,
      expTime,
    });

    await otp.save();

    // TODO: Send OTP via SMS (placeholder)
    console.log(`OTP for ${phone}: ${otpCode}`);

    return NextResponse.json({ message: 'OTP sent to your phone' }, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
