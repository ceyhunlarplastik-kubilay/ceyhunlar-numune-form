/* import config from "../config";
import { publicBucket } from "./storage";

const isPermanentStage = ["prod", "dev"].includes($app.stage);

const domain =
    $app.stage === "prod"
        ? config.DOMAIN
        : $app.stage === "dev"
            ? `dev.${config.DOMAIN}`
            : undefined;

const hostedZone = isPermanentStage ? config.HOSTED_ZONE_ID : undefined;

export const cdnRouter = isPermanentStage
    ? new sst.aws.Router("NumuneForm-CdnRouter", {
        domain: {
            name: `cdn.${domain}`,
            dns: sst.aws.dns({
                zone: hostedZone,
            }),
        },
        routes: {
            "/": {
                bucket: publicBucket,
            },
        },
    })
    : undefined;
 */