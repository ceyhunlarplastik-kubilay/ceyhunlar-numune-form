import * as path from "node:path";

try {
    console.log("Attempting to load .env file...");
    // Try loading from current working directory
    process.loadEnvFile(path.join(process.cwd(), ".env"));
    console.log("Successfully loaded .env file");
} catch (e) {
    console.log("Could not load .env file (might be in production or missing):", e);
}

interface ENV {
    HOSTED_ZONE_ID: string | undefined;
    DOMAIN: string | undefined;
    CLERK_SECRET_KEY: string | undefined;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string | undefined;
    GOOGLE_EMAIL: string | undefined;
    GOOGLE_APP_PASSWORD: string | undefined;
    GOOGLE_CLIENT_EMAIL: string | undefined;
    GOOGLE_PRIVATE_KEY: string | undefined;
    MONGO_URI: string | undefined;
    MONGO_GEO_URI: string | undefined;
    SPREADSHEET_ID: string | undefined;
    AWS_REGION: string | undefined;
    TURKIYE_API_URL: string | undefined;
}

interface Config {
    HOSTED_ZONE_ID: string;
    DOMAIN: string;
    CLERK_SECRET_KEY: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    GOOGLE_EMAIL: string;
    GOOGLE_APP_PASSWORD: string;
    GOOGLE_CLIENT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
    MONGO_URI: string;
    MONGO_GEO_URI: string;
    SPREADSHEET_ID: string;
    AWS_REGION: string;
    TURKIYE_API_URL: string;
}

const getConfig = (): ENV => {
    return {
        HOSTED_ZONE_ID: process.env.HOSTED_ZONE_ID,
        DOMAIN: process.env.DOMAIN,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        GOOGLE_EMAIL: process.env.GOOGLE_EMAIL,
        GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
        GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
        GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
        MONGO_URI: process.env.MONGO_URI,
        MONGO_GEO_URI: process.env.MONGO_GEO_URI,
        SPREADSHEET_ID: process.env.SPREADSHEET_ID,
        AWS_REGION: process.env.AWS_REGION,
        TURKIYE_API_URL: process.env.TURKIYE_API_URL,
    };
};

const getSanitizedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} from environment variables`);
        }
    }
    return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;