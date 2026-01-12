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
    const { publicBucket } = await import("./infra/storage");
    // const { appRouter } = await import("./infra/router");
    // const { cdnRouter } = await import("./infra/router.cdn");
    const { nextjs } = await import("./infra/frontend");

    return {
      MyBucket: publicBucket.name,
      NumuneFormFrontend: nextjs.url,
    };
  },
});
