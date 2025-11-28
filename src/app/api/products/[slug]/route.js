import { NextResponse } from "next/server";
import connectToDB from "base/configs/db";

import Brand from "base/models/Brand";
import Sport from "base/models/Sport";
import Athlete from "base/models/Athlete";
import Product from "base/models/Product";

export async function POST(req) {
  await connectToDB();

  const body = await req.json();
  const slugArray = body.slugs || [];

  const search = {
    brand: null,
    sport: null,
    athlete: null,
    product: null,
  };

  // ----------- 1) پردازش Query Params  -----------
  const { searchParams } = new URL(req.url);

  if (searchParams.get("brand")) {
    search.brand = await Brand.findOne({ slug: searchParams.get("brand") }).lean();
  }

  if (searchParams.get("sport")) {
    search.sport = await Sport.findOne({ slug: searchParams.get("sport") }).lean();
  }

  if (searchParams.get("athlete")) {
    search.athlete = await Athlete.findOne({ slug: searchParams.get("athlete") }).lean();
  }

  if (searchParams.get("product")) {
    search.product = await Product.findOne({ slug: searchParams.get("product") }).lean();
  }

  // ----------- 2) پردازش Slugs (هوشمند) -----------
  for (const slug of slugArray) {
    if (!search.brand) {
      const doc = await Brand.findOne({ slug }).lean();
      if (doc) {
        search.brand = doc;
        continue;
      }
    }

    if (!search.sport) {
      const doc = await Sport.findOne({ slug }).lean();
      if (doc) {
        search.sport = doc;
        continue;
      }
    }

    if (!search.athlete) {
      const doc = await Athlete.findOne({ slug }).lean();
      if (doc) {
        search.athlete = doc;
        continue;
      }
    }

    if (!search.product) {
      const doc = await Product.findOne({ slug }).lean();
      if (doc) {
        search.product = doc;
        continue;
      }
    }
  }

  // ----------- 3) ساخت کوئری نهایی محصولات -----------
  const finalFilter = {};

  if (search.brand) finalFilter.brand = search.brand._id;
  if (search.sport) finalFilter.sport = search.sport._id;
  if (search.athlete) finalFilter.athlete = search.athlete._id;
  if (search.product) finalFilter._id = search.product._id;

  const products = await Product.find(finalFilter)
    .populate("brand sport athlete")
    .lean();

  return NextResponse.json({
    filters: {
      brand: search.brand,
      sport: search.sport,
      athlete: search.athlete,
      product: search.product,
    },
    results: products,
  });
}
  