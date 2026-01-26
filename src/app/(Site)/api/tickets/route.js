import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Ticket from "base/models/Ticket";

export async function GET(req) {
  try {
    await connectToDB();
    const tickets = await Ticket.find({}).populate('department user request answer');
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { title, body: ticketBody, department, priority, user, request } = body;

    // Validation
    if (!title || !ticketBody || !department || !user) {
      return NextResponse.json({ error: "Title, body, department, and user are required" }, { status: 400 });
    }

    const newTicket = new Ticket({
      title: title.trim(),
      body: ticketBody.trim(),
      department,
      priority: priority || 3,
      user,
      request
    });

    await newTicket.save();
    return NextResponse.json({ ticket: newTicket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
