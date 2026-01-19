import config from "../config";

const isPermanentStage = ["prod", "dev"].includes($app.stage);

const domain =
    $app.stage === "prod"
        ? config.DOMAIN
        : $app.stage === "dev"
            ? `dev.${config.DOMAIN}`
            : undefined;

const hostedZone = isPermanentStage ? config.HOSTED_ZONE_ID : undefined;

export const appRouter = isPermanentStage
    ? new sst.aws.Router("NumuneForm-AppRouter", {
        domain: {
            name: domain,
            aliases: [`*.${domain}`],
            dns: sst.aws.dns({
                zone: hostedZone,
            }),
        },
    })
    : undefined;
