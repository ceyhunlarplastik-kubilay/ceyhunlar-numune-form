import { NextResponse } from "next/server";
import { StateModel } from "@/models/geo/State.model";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countryCode = searchParams.get("country");

        if (!countryCode) {
            return NextResponse.json(
                { error: "country query param is required (e.g. ?country=TR)" },
                { status: 400 }
            );
        }

        const State = await StateModel();

        const states = await State.find({
            country_code: countryCode,
        })
            .sort({ name: 1 })
            .lean();

        return NextResponse.json(states);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
