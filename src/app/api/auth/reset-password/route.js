import { NextResponse } from 'next/server';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import { hasher, validatePassword } from 'base/utils/auth';

export async function POST(request) {
  try {
    await connectToDB();

    const { phone, password } = await request.json();

    // Validation
    if (!phone || !password) {
      return NextResponse.json({ message: 'Phone and password are required' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ phone, provider: 'local' });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await hasher(password);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
