/* import config from "../config";
import { appRouter } from "./router";
import { publicBucket } from "./storage";

export const nextjs = new sst.aws.Nextjs("NumuneForm-Frontend", {
  path: "packages/next-app",
  // ...(['prod', 'dev'].includes($app.stage) && appRouter ? { router: { instance: appRouter } } : {}),
  ...(appRouter ? { router: { instance: appRouter } } : {}),
  link: [publicBucket],
  // Force webpack build for OpenNext v3.6.6 compatibility  
  buildCommand: "TURBOPACK=0 npm run build",
  environment: {
    STAGE: $app.stage,
    DOMAIN: config.DOMAIN,
    CLERK_SECRET_KEY: config.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: config.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    GOOGLE_EMAIL: config.GOOGLE_EMAIL,
    GOOGLE_APP_PASSWORD: config.GOOGLE_APP_PASSWORD,
    GOOGLE_CLIENT_EMAIL: config.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: config.GOOGLE_PRIVATE_KEY,
    MONGO_URI: config.MONGO_URI,
    SPREADSHEET_ID: config.SPREADSHEET_ID,

  },
}); */


import config from "../config";
import { publicBucket } from "./storage";
// import { GOOGLE_PRIVATE_KEY_B64, MONGO_URI } from "./secrets";
// import { mongoUriSecret, googlePrivateKeySecret } from "./secrets";

export const frontend = new sst.aws.Nextjs("NumuneForm-Frontend", {
  // path: "packages/next-app",
  path: "packages/frontend",

  /* domain:
    $app.stage === "prod"
      ? {
        name: config.DOMAIN,
        dns: sst.aws.dns({
          zone: config.HOSTED_ZONE_ID,
        }),
      }
      : $app.stage === "dev"
        ? {a
          name: `dev.${config.DOMAIN}`,
          dns: sst.aws.dns({
            zone: config.HOSTED_ZONE_ID,
          }),
        }
        : undefined, */

  link: [publicBucket],

  // buildCommand: "npm run build -- --webpack",

  environment: {
    STAGE: $app.stage,
    // DOMAIN: config.DOMAIN,
    CLERK_SECRET_KEY: config.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: config.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    GOOGLE_EMAIL: config.GOOGLE_EMAIL,
    GOOGLE_APP_PASSWORD: config.GOOGLE_APP_PASSWORD,
    GOOGLE_CLIENT_EMAIL: config.GOOGLE_CLIENT_EMAIL,
    SPREADSHEET_ID: config.SPREADSHEET_ID,
    // GOOGLE_PRIVATE_KEY_B64: `numune-form/${$app.stage}/GOOGLE_PRIVATE_KEY_B64`,
    // MONGO_URI: `numune-form/${$app.stage}/MONGO_URI`,
    // GOOGLE_PRIVATE_KEY and MONGO_URI are now provided via linked secrets
    GOOGLE_PRIVATE_KEY: config.GOOGLE_PRIVATE_KEY,
    MONGO_URI: config.MONGO_URI,
  },
});
