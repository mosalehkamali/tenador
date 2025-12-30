import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Department from "base/models/Department";

export async function GET(req) {
  try {
    await connectToDB();
    const departments = await Department.find({}).populate('tickets');
    return NextResponse.json({ departments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { title } = body;

    // Validation
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newDepartment = new Department({
      title: title.trim()
    });

    await newDepartment.save();
    return NextResponse.json({ department: newDepartment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
