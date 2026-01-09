import { verifyToken, getTokenFromRequest } from "./jwt";
import { getUserById, type User } from "../db/turso";

/**
 * Get authenticated user from request token
 */
export async function getAuthenticatedUser(request: Request): Promise<User | null> {
    const token = getTokenFromRequest(request);
    const payload = await verifyToken(token);
    
    if (!payload || !payload.id) {
        return null;
    }
    
    return await getUserById(payload.id);
}

