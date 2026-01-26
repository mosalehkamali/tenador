import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Address from "base/models/Address";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const address = await Address.findById(id).populate('user');
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json({ address });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
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

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        user,
        title: title.trim(),
        fullName: fullName.trim(),
        phone,
        city,
        addressLine,
        postalCode,
        isDefault: !!isDefault,
      },
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
