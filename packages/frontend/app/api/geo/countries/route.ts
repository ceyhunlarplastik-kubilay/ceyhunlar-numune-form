import { NextResponse } from "next/server";
import { CountryModel } from "@/models/geo/Country.model";

export async function GET() {
  const Country = await CountryModel();
  const countries = await Country.find().sort({ name: 1 }).lean();
  return NextResponse.json(countries);
}
