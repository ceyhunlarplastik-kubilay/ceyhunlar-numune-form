/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "numune-form",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // await import("./infra/api");
    // const { googlePrivateKeyB64Secret, mongoUriSecret } = await import("./infra/secrets");
    const { publicBucket } = await import("./infra/storage");
    // const { appRouter } = await import("./infra/router");
    // const { cdnRouter } = await import("./infra/router.cdn");
    const { frontend } = await import("./infra/frontend");

    return {
      MyBucket: publicBucket.name,
      // frontend: frontend.default.url,
    };
  },
});
