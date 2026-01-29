import { Schema, Model } from "mongoose";
import { connectGeoDB } from "@/lib/mongodb-geo";

export interface ICity {
  _id: number; // 153788
  name: string;

  country_id: number;
  country_code: string;
  country_name: string;

  state_id: number;
  state_code: string;
  state_name: string;

  native?: string;
  type?: string;
  level?: string;

  latitude?: string;
  longitude?: string;

  population?: number;
  timezone?: string;

  translations?: Record<string, string>;

  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };

  wikiDataId?: string;
}

const CitySchema = new Schema<ICity>(
  {
    _id: { type: Number },
    name: { type: String, required: true },

    country_id: { type: Number, required: true },
    country_code: { type: String },
    country_name: String,

    state_id: { type: Number, required: true },
    state_code: { type: String },
    state_name: String,

    native: String,
    type: String,
    level: String,

    latitude: String,
    longitude: String,

    population: Number,
    timezone: String,

    translations: Schema.Types.Mixed,

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    wikiDataId: String,
  },
  {
    collection: "cities",
    versionKey: false,
  }
);

CitySchema.index({ location: "2dsphere" });
CitySchema.index({ country_id: 1, country_code: 1, state_id: 1, state_code: 1 });

export async function CityModel(): Promise<Model<ICity>> {
  const conn = await connectGeoDB();
  return conn.models.City || conn.model("City", CitySchema);
}
