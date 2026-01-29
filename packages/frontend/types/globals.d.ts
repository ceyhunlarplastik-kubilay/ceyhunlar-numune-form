export { }

// Create a type for the Roles
export type Roles = "owner" | "admin" | "moderator"

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles
        }
    }
}