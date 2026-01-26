import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import { tokenGenrator, generateRefreshToken } from 'base/utils/auth';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { message: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // 1️⃣ Exchange code for tokens
    const { tokens } = await client.getToken(code);

    if (!tokens.access_token) {
      throw new Error('No access token received from Google');
    }

    // 2️⃣ Fetch user info (SAFE & OFFICIAL)
    const userinfoRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userinfoRes.ok) {
      throw new Error('Failed to fetch Google user info');
    }

    const { sub, email, name, picture } = await userinfoRes.json();

    if (!sub || !email) {
      throw new Error('Incomplete Google user info');
    }

    const googleId = sub;

    // 3️⃣ DB
    await connectToDB();

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        provider: 'google',
        googleId,
        email,
        name,
        avatar: picture,
        phoneVerified: true,
      });
      await user.save();
    }

    // 4️⃣ Internal tokens
    const accessToken = tokenGenrator({
      userId: user._id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      email: user.email,
    });

    // 5️⃣ Cookies + redirect
    const response = NextResponse.redirect(new URL('/', request.url));

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login-register?error=oauth_failed', request.url)
    );
  }
}
