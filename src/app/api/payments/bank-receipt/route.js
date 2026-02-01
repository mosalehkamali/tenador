import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import { verifyToken } from "base/utils/auth";
import { cookies } from "next/headers";
import Order from "base/models/Order";
import Payment from "base/models/Payment";

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
export async function POST(req) {
  try {
    await connectToDB();

    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      orderId,
      method, // "ONLINE" | "BANK_RECEIPT"
      amount,
      authority,
      refId,
      gateway,
      receiptImageUrl,
    } = await req.json();

    // ===== Validation =====
    if (!orderId || !method || !amount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["ONLINE", "BANK_RECEIPT"].includes(method)) {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      _id: orderId,
      user: user.userId,
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // ===== ساخت Payment =====
    const paymentData = {
      order: order._id,
      method,
      amount,
      status: method === "ONLINE" ? "PAID" : "PENDING",
    };

    // آنلاین
    if (method === "ONLINE") {
      paymentData.onlinePayment = {
        authority,
        refId,
        gateway,
        paidAt: new Date(),
      };
    }

    // رسید بانکی
    if (method === "BANK_RECEIPT") {
      if (!receiptImageUrl) {
        return NextResponse.json(
          { message: "Receipt image is required" },
          { status: 400 }
        );
      }

      paymentData.bankReceipt = {
        imageUrl: receiptImageUrl,
        uploadedAt: new Date(),
        reviewStatus: "PENDING",
      };
    }

    const payment = await Payment.create(paymentData);

    // ===== اضافه کردن به آرایه payments در Order =====
    order.payments.push(payment._id);

    // ===== آپدیت وضعیت مالی سفارش =====
    if (method === "ONLINE") {
      const totalPaid = await Payment.aggregate([
        { $match: { order: order._id, status: "PAID" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const paidAmount = totalPaid[0]?.total || 0;

      if (paidAmount >= order.totalPrice) {
        order.paymentStatus = "PAID";
      } else if (paidAmount > 0) {
        order.paymentStatus = "PARTIALLY_PAID";
      }
    }

    await order.save();

    return NextResponse.json(
      { message: "Payment created successfully", payment },
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
