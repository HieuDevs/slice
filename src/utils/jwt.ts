import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET } from 'astro:env/server';

// JWT secret key - in production, use environment variable
const JWT_SECRET_KEY = new TextEncoder().encode(
    JWT_SECRET || "your-secret-key-change-in-production"
);

const JWT_EXPIRES_IN = "30d"; // Token expires in 30 days

export interface JWTPayload {
    id: number;
    [key: string]: unknown; // Index signature to match jose library's JWTPayload type
}

/**
 * Create a JWT token for a user
 */
export async function createToken(userId: number): Promise<string> {
    const payload: JWTPayload = { id: userId };
    
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET_KEY);

    return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string | null): Promise<JWTPayload | null> {
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
        return payload as JWTPayload;
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromRequest(request: Request): string | null {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.substring(7); // Remove "Bearer " prefix
}

