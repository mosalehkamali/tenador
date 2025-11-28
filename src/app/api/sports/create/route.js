import connectToDB from "base/configs/db";
import Sport from "base/models/Sport";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, description, icon } = body;

    if (!name || name.trim() === "") {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // check duplicate
    const exists = await Sport.findOne({ name });
    if (exists) {
      return Response.json(
        { error: "Sport already exists" },
        { status: 409 }
      );
    }

    const created = await Sport.create({
      name,
      description,
      icon,
    });

    return Response.json(
      { message: "Sport created successfully", sport: created },
      { status: 201 }
    );

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
