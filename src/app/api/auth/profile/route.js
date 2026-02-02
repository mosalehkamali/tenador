import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDB from 'base/configs/db';
import User from 'base/models/User';
import { verifyToken } from 'base/utils/auth';

export async function GET() {
  try {
    await connectToDB();

    const cookieStore = await cookies(); // ✅ مهم
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          addresses: user.addresses,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/* =========================
   Helper: Get User From Token
========================= */
async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded; 
}

export async function PATCH(req) {
  try {
    const authUser = await getUserFromToken();  // گرفتن اطلاعات کاربر از توکن
    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();  // گرفتن داده‌های درخواست
    const { email, phone, name, avatar } = body;

    const user = await User.findById(authUser.userId);  // یافتن کاربر از طریق ID
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // بررسی اینکه آیا ایمیل جدید تکراری نیست
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { message: "This email is already in use" },
          { status: 400 }
        );
      }
      user.email = email.trim();  // اعمال تغییرات
    }

    // بررسی اینکه آیا شماره تلفن جدید تکراری نیست
    if (phone && phone !== user.phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return NextResponse.json(
          { message: "This phone number is already in use" },
          { status: 400 }
        );
      }
      user.phone = phone.trim();  // اعمال تغییرات
    }

    // اعمال تغییرات برای دیگر فیلدها
    if (name !== undefined) user.name = name.trim();
    if (avatar !== undefined) user.avatar = avatar;

    // ذخیره تغییرات در دیتابیس
    await user.save();

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



