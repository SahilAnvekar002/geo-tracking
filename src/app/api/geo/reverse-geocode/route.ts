import { NextRequest, NextResponse } from "next/server";

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  try {
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`,
      { next: { revalidate: 86400 } } // cache 24h
    );

    if (!geoRes.ok) {
      throw new Error("Geoapify failed");
    }

    const data = await geoRes.json();
    const props = data.features?.[0]?.properties;

    return NextResponse.json({
      address: props?.formatted,
      city: props?.city,
      state: props?.state,
      country: props?.country,
      postcode: props?.postcode,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Reverse geocoding failed" },
      { status: 500 }
    );
  }
}
