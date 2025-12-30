import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Address from "base/models/Address";

export async function GET(req) {
  try {
    await connectToDB();
    const addresses = await Address.find({}).populate('user');
    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { user, title, fullName, phone, city, addressLine, postalCode, isDefault } = body;

    // Validation
    if (!user || !title || !fullName || !phone || !city || !addressLine) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAddress = new Address({
      user,
      title: title.trim(),
      fullName: fullName.trim(),
      phone,
      city,
      addressLine,
      postalCode,
      isDefault: isDefault || false
    });

    await newAddress.save();
    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
