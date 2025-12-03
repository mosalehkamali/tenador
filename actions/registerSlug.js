"use server";

import SlugRegistry from "base/models/SlugRegistery";
import connectToDB from "base/configs/db";

export async function registerSlug({
  slug,
  type,
  model,
  refId,
  filterField,
  filterValue,
  label = null,
  parentSlug = null
}) {
  await connectToDB();

  const exists = await SlugRegistry.findOne({ slug });

  if (exists) return exists;

  const record = await SlugRegistry.create({
    slug,
    type,
    model,
    refId,
    filterField,
    filterValue,
    label,
    parentSlug,
  });

  return record;
}
