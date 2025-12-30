import { NextResponse } from 'next/server';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import { hasher, tokenGenrator, generateRefreshToken, validatePhone, validatePassword } from 'base/utils/auth';

export async function POST(request) {
  try {
    await connectToDB();

    const { phone, password, name } = await request.json();

    // Validation
    if (!phone || !password) {
      return NextResponse.json({ message: 'Phone and password are required' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hasher(password);

    // Create user
    const newUser = new User({
      phone,
      password: hashedPassword,
      name: name || '',
    });

    await newUser.save();

    // Generate tokens
    const accessToken = tokenGenrator({ userId: newUser._id, phone: newUser.phone });
    const refreshToken = generateRefreshToken({ userId: newUser._id, phone: newUser.phone });

    // Set cookies
    const response = NextResponse.json({ message: 'Registration successful', user: { id: newUser._id, phone: newUser.phone, name: newUser.name } }, { status: 201 });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
