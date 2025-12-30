import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import { tokenGenrator, generateRefreshToken } from 'base/utils/auth';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ message: 'Authorization code is required' }, { status: 400 });
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify id_token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ message: 'Invalid ID token' }, { status: 400 });
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    await connectToDB();

    // Check if user exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user
      user = new User({
        provider: 'google',
        googleId,
        email,
        name,
        avatar,
        phoneVerified: true,
      });
      await user.save();
    }

    // Generate internal JWT tokens
    const accessToken = tokenGenrator({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id, email: user.email });

    // Set cookies
    const response = NextResponse.redirect(new URL('/', request.url));

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60, // 5 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60, // 15 days
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login-register?error=oauth_failed', request.url));
  }
}
