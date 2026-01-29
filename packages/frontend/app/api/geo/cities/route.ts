import { NextResponse } from "next/server";
import { CityModel } from "@/models/geo/City.model";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countryCode = searchParams.get("country");
        const stateCode = searchParams.get("state");

        if (!countryCode || !stateCode) {
            return NextResponse.json(
                {
                    error:
                        "country and state query params are required (e.g. ?country=TR&state=01)",
                },
                { status: 400 }
            );
        }

        const City = await CityModel();

        const cities = await City.find({
            country_code: countryCode,
            state_code: stateCode,
        })
            .sort({ name: 1 })
            .lean();

        return NextResponse.json(cities);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
