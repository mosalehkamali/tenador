import connectToDB from "base/configs/db";
import Athlete from "base/models/Athlete";
import Sport from "base/models/Sport";
import { registerSlug } from "base/actions/registerSlug";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      name,
      title,
      sport,
      birthDate,
      nationality,
      bio,
      photo,
    } = body;

    /* ---------- validations ---------- */

    if (!name || !name.trim()) {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // regex validation (same as model)
    const nameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!nameRegex.test(name)) {
      return Response.json(
        {
          error:
            "Name must contain only English letters, numbers, spaces, - or _",
        },
        { status: 400 }
      );
    }

    if (!sport) {
      return Response.json(
        { error: "Sport is required" },
        { status: 400 }
      );
    }

    const sportFound = await Sport.findById(sport);
    if (!sportFound) {
      return Response.json(
        { error: "Sport not found" },
        { status: 404 }
      );
    }

    // duplicate athlete (same name in same sport)
    const exists = await Athlete.findOne({
      name: name.trim(),
      sport,
    });

    if (exists) {
      return Response.json(
        { error: "Athlete already exists for this sport" },
        { status: 409 }
      );
    }

    /* ---------- create ---------- */

    const created = await Athlete.create({
      name: name.trim(),
      title: title.trim(),
      sport,
      birthDate: birthDate ? new Date(birthDate) : null,
      nationality: nationality?.trim() || "",
      bio: bio || "",
      photo: photo || "",
    });

    /* ---------- slug registry ---------- */

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
      {
        message: "Athlete created successfully",
        athlete: created,
      },
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
