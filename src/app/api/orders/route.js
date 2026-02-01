import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";

import { verifyToken } from "base/utils/auth.js";
import Order from "base/models/Order.js";
import Payment from "base/models/Payment.js";
import Installment from "base/models/Installment.js";
import Address from "base/models/Address.js";

/* =========================
   Helper: Get User From Token
========================= */
async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded; // باید شامل userId باشه
}

/* =========================
   POST → Create Order
========================= */
export async function POST(req) {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, totalPrice, paymentMethod, addressId, description } =
      await req.json();

    // 🔎 Validation
    if (!items?.length || !totalPrice || !paymentMethod || !addressId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["ONLINE", "BANK_RECEIPT", "INSTALLMENT"].includes(paymentMethod)) {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      );
    }

    if (totalPrice <= 0) {
      return NextResponse.json(
        { message: "Invalid total price" },
        { status: 400 }
      );
    }

    // 🔥 گرفتن آدرس و ساخت snapshot
    const addressDoc = await Address.findOne({
      _id: addressId,
      user: user.userId,
    });

    if (!addressDoc) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    // 📦 ساخت سفارش
    const order = await Order.create({
      user: user.userId,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus:"UNPAID",
      fulfillmentStatus: "WAITING",
      address: {
        ref: addressDoc._id,
        snapshot: {
          fullName: addressDoc.fullName,
          phone: addressDoc.phone,
          province: addressDoc.province,
          city: addressDoc.city,
          postalCode: addressDoc.postalCode,
          fullAddress: addressDoc.fullAddress,
        },
      },
      description,
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =========================
   GET → Get User Orders
========================= */
export async function GET() {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ user: user.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
