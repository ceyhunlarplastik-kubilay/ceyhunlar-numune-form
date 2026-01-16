const isPermanentStage = ["prod", "dev"].includes($app.stage);

export const publicBucket = new sst.aws.Bucket("NumuneFormBucket", {
    bucketName:
        $app.stage === "prod"
            ? "numune-form-prod-assets"
            : `numune-form-${$app.stage}-assets`,
    access: "public",
});
