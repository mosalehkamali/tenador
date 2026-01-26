import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";

import Athlete from "base/models/Athlete";

export async function GET(req) {
  await connectToDB();
  const athletes = await Athlete.find({}).populate('sport');
  return NextResponse.json({
    athletes,
  });
}