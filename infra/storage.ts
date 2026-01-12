const isPermanentStage = ["prod", "dev"].includes($app.stage);

export const publicBucket = new sst.aws.Bucket("NumuneFormBucket", {
    // access: isPermanentStage ? "cloudfront" : "public",
    access: "public",
});
