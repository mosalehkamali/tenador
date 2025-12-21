import connectToDB from "base/configs/db";
import Athlete from "base/models/Athlete";
import Sport from "base/models/Sport";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { athleteId } = await params;
    const athlete = await Athlete.findById(athleteId).populate('sport');
    
    if (!athlete) {
      return NextResponse.json(
        { error: "ورزشکار پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ athlete });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { athleteId } = await params;
    const body = await req.json();
    const { name, sport, birthDate, nationality, bio, photo } = body;

    const athlete = await Athlete.findById(athleteId);
    if (!athlete) {
      return NextResponse.json(
        { error: "ورزشکار پیدا نشد" },
        { status: 404 }
      );
    }

    if (name && name.trim() !== "") {
      athlete.name = name.trim();
    }
    if (sport) {
      const sportFound = await Sport.findById(sport);
      if (!sportFound) {
        return NextResponse.json(
          { error: "ورزش پیدا نشد" },
          { status: 404 }
        );
      }
      athlete.sport = sport;
    }
    if (birthDate !== undefined) {
      athlete.birthDate = birthDate ? new Date(birthDate) : null;
    }
    if (nationality !== undefined) {
      athlete.nationality = nationality;
    }
    if (bio !== undefined) {
      athlete.bio = bio;
    }
    if (photo !== undefined) {
      athlete.photo = photo;
    }

    await athlete.save();

    return NextResponse.json({
      message: "ورزشکار با موفقیت به‌روزرسانی شد",
      athlete,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { athleteId } = await params;
    
    const athlete = await Athlete.findByIdAndDelete(athleteId);
    if (!athlete) {
      return NextResponse.json(
        { error: "ورزشکار پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "ورزشکار با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}








