import connectToDB from "base/configs/db";
import Brand from "base/models/Brand";

export async function POST(req) {
    try {
      await connectToDB();

    const body = await req.json();

    const { name, country, foundedYear, description, logo } = body;

    if (!name || name.trim() === "") {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // check duplicate
    const exists = await Brand.findOne({ name });
    if (exists) {
      return Response.json(
        { error: "Brand already exists" },
        { status: 409 }
      );
    }

    const created = await Brand.create({
      name,
      country,
      foundedYear,
      description,
      logo,
    });

    return Response.json(
      { message: "Brand created successfully", brand: created },
      { status: 201 }
    );

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

