import { Schema, Model } from "mongoose";
import { connectGeoDB } from "@/lib/mongodb-geo";

export interface IState {
    _id: number; // 2212
    name: string;

    country_id: number;
    country_code: string;
    country_name: string;

    iso2: string; // "01"
    iso3166_2: string; // "TR-01"

    fips_code?: string;
    type?: string; // province
    level?: string;

    native?: string;
    latitude?: string;
    longitude?: string;

    timezone?: string;
    wikiDataId?: string;

    population?: number;

    translations?: Record<string, string>;
}

const StateSchema = new Schema<IState>(
    {
        _id: { type: Number },
        name: { type: String, required: true },

        country_id: { type: Number, required: true },
        country_code: { type: String },
        country_name: String,

        iso2: { type: String },
        iso3166_2: String,

        fips_code: String,
        type: String,
        level: String,

        native: String,
        latitude: String,
        longitude: String,

        timezone: String,
        wikiDataId: String,

        population: Number,

        translations: Schema.Types.Mixed,
    },
    {
        collection: "states",
        versionKey: false,
    }
);

StateSchema.index({ country_id: 1, country_code: 1, iso2: 1 }, { unique: true });

export async function StateModel(): Promise<Model<IState>> {
    const conn = await connectGeoDB();
    return conn.models.State || conn.model("State", StateSchema);
}
