import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Address from "base/models/Address";

export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    const { id } = await params;
    const { user } = await req.json();

    if (!user) {
      return NextResponse.json(
        { error: "User is required" },
        { status: 400 }
      );
    }

    // 1️⃣ بررسی وجود آدرس
    const address = await Address.findById(id);
    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // 2️⃣ مالکیت (خیلی مهم)
    if (address.user.toString() !== user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // 3️⃣ همه آدرس‌های کاربر ← false
    await Address.updateMany(
      { user },
      { $set: { isDefault: false } }
    );

    // 4️⃣ این آدرس ← true
    address.isDefault = true;
    await address.save();

    return NextResponse.json({
      message: "Default address updated",
      address,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
