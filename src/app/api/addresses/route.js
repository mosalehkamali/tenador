import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Address from "base/models/Address";
import { cookies } from 'next/headers';
import { verifyToken } from "base/utils/auth";

export async function GET(req) {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    const user = verifyToken(token)
    
    const addresses = await Address.find({
      user: user.userId
    }).select('-__v');
    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    const userAuth = verifyToken(token)

    const body = await req.json();
    const { user, title, fullName, phone, city, addressLine, postalCode, isDefault } = body;

    if (!user || !title || !fullName || !phone || !city || !addressLine) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🔥 ENFORCE SINGLE DEFAULT
    if (isDefault) {
      await Address.updateMany(
        { user },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new Address({
      user:userAuth.userId,
      title: title.trim(),
      fullName: fullName.trim(),
      phone,
      city,
      addressLine,
      postalCode,
      isDefault: !!isDefault,
    });

    await newAddress.save();
    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
