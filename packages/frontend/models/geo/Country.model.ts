import { Schema, Model } from "mongoose";
import { connectGeoDB } from "@/lib/mongodb-geo";

export interface ICountry {
  _id: number; // 225
  name: string;
  iso2: string;
  iso3: string;
  numeric_code: string;
  phonecode: string;
  capital?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  tld?: string;
  native?: string;
  population?: number;
  gdp?: number;
  nationality?: string;
  area_sq_km?: number;
  postal_code_format?: string;
  postal_code_regex?: string;

  region_id?: number;
  subregion_id?: number;

  latitude?: string;
  longitude?: string;

  emoji?: string;
  emojiU?: string;
  wikiDataId?: string;

  timezones?: {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }[];

  translations?: Record<string, string>;
}

const CountrySchema = new Schema<ICountry>(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    iso2: { type: String },
    iso3: String,
    numeric_code: String,
    phonecode: String,
    capital: String,

    currency: String,
    currency_name: String,
    currency_symbol: String,

    tld: String,
    native: String,
    nationality: String,

    population: Number,
    gdp: Number,
    area_sq_km: Number,

    postal_code_format: String,
    postal_code_regex: String,

    region_id: Number,
    subregion_id: Number,

    latitude: String,
    longitude: String,

    emoji: String,
    emojiU: String,
    wikiDataId: String,

    timezones: [
      {
        zoneName: String,
        gmtOffset: Number,
        gmtOffsetName: String,
        abbreviation: String,
        tzName: String,
      },
    ],

    translations: Schema.Types.Mixed,
  },
  {
    collection: "countries",
    versionKey: false,
  }
);

CountrySchema.index({ iso2: 1 }, { unique: true });

export async function CountryModel(): Promise<Model<ICountry>> {
  const conn = await connectGeoDB();
  return conn.models.Country || conn.model("Country", CountrySchema);
}
