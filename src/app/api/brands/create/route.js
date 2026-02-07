import connectToDB from "base/configs/db";
import Brand from "base/models/Brand";
import { registerSlug } from "base/actions/registerSlug";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      name,
      title,
      country = null,
      foundedYear = null,
      description = "",
      logo = "",
      icon = "",
      image = "",
      models = [],
    } = body;

    // validation
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

    const normalizedName = name.trim();

    // check name regex (same as model, fail fast)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(normalizedName)) {
      return Response.json(
        { error: "Name format is invalid" },
        { status: 400 }
      );
    }

    // foundedYear sanity check
    if (
      foundedYear !== null &&
      (typeof foundedYear !== "number" ||
        foundedYear < 1800 ||
        foundedYear > new Date().getFullYear())
    ) {
      return Response.json(
        { error: "Founded year is invalid" },
        { status: 400 }
      );
    }

    // duplicate check
    const exists = await Brand.findOne({ name: normalizedName });
    if (exists) {
      return Response.json(
        { error: "Brand already exists" },
        { status: 409 }
      );
    }

    // create brand
    const created = await Brand.create({
      name: normalizedName,
      title: title.trim(),
      country,
      foundedYear,
      description: description.trim(),
      logo: logo.trim(),
      icon: icon.trim(),
      image: image.trim(),
      models: Array.isArray(models) ? models : [],
    });

    // register slug
    await registerSlug({
      slug: created.slug,
      type: "brand",
      model: "Brand",
      refId: created._id,
      filterField: "brand",
      filterValue: created._id,
      label: created.title,
      parentSlug: null,
    });

    return Response.json(
      {
        message: "Brand created successfully",
        brand: created,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      return Response.json(
        { error: err.message },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
