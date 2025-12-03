import connectToDB from "base/configs/db";
import Athlete from "base/models/Athlete";
import Sport from "base/models/Sport";
import {registerSlug} from "base/actions/registerSlug";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, sport, birthDate, nationality, bio, photo } = body;

    // Validate name
    if (!name || name.trim() === "") {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Validate sport exists
    const sportFound = await Sport.findById(sport);
    if (!sportFound) {
      return Response.json(
        { error: "Sport not found" },
        { status: 404 }
      );
    }

    // Check duplicate by name
    const exists = await Athlete.findOne({ name });
    if (exists) {
      return Response.json(
        { error: "Athlete already exists" },
        { status: 409 }
      );
    }

    const created = await Athlete.create({
      name,
      sport,
      birthDate,
      nationality,
      bio,
      photo,
    });

    await registerSlug({
      slug: created.slug,
      type: "athlete",
      model: "Athlete",
      refId: created._id,
      filterField: "athlete",
      filterValue: created._id,
      label: created.name,
      parentSlug: null,
    });
    return Response.json(
      { message: "Athlete created successfully", athlete: created },
      { status: 201 }
    );

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
