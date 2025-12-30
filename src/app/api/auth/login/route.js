import { NextResponse } from 'next/server';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import { passwordValidator, tokenGenrator, generateRefreshToken, validatePhone } from 'base/utils/auth';

export async function POST(request) {
  try {
    await connectToDB();

    const { phone, password } = await request.json();

    // Validation
    if (!phone || !password) {
      return NextResponse.json({ message: 'Phone and password are required' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Validate password
    const isValid = await passwordValidator(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Generate tokens
    const accessToken = tokenGenrator({ userId: user._id, phone: user.phone });
    const refreshToken = generateRefreshToken({ userId: user._id, phone: user.phone });

    // Set cookies
    const response = NextResponse.json({ message: 'Login successful', user: { id: user._id, phone: user.phone, name: user.name } }, { status: 200 });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10, // 10 seconds
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60, // 15 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
