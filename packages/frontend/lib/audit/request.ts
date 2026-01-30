export function buildRequestMeta(req: Request) {
    return {
        path: new URL(req.url).pathname,
        ip: req.headers.get("x-forwarded-for") ?? undefined,
        userAgent: req.headers.get("user-agent") ?? undefined,
    };
}
