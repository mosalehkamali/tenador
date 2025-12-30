import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";
import Ticket from "base/models/Ticket";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const ticket = await Ticket.findById(id).populate('department user request answer');
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { title, body: ticketBody, department, priority, user, request } = body;

    // Validation
    if (!title || !ticketBody || !department || !user) {
      return NextResponse.json({ error: "Title, body, department, and user are required" }, { status: 400 });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        body: ticketBody.trim(),
        department,
        priority: priority || 3,
        user,
        request
      },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
