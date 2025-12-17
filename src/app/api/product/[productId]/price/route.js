import { NextResponse } from "next/server";
import { redis } from "base/lib/redis";

export async function GET(request, { params }) {
  const { id } = params;

  const cached = await redis.get(`product:finalPrice:${id}`);

  if (!cached) {
    return NextResponse.json(
      { error: "Price not computed yet" },
      { status: 404 }
    );
  }

  return NextResponse.json(JSON.parse(cached));
}
