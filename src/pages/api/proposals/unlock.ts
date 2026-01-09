import type { APIRoute } from "astro";
import { getTurso } from "../../../db/turso";
import { getAuthenticatedUser } from "../../../utils/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);
    
    // Only admin can toggle lock/unlock
    if (!user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Forbidden. Only admin can toggle lock." }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const turso = getTurso();
        // Get current lock status
        const currentStatus = await turso.execute("SELECT is_locked FROM workshop_settings WHERE id = 1");
        const isCurrentlyLocked = currentStatus.rows.length > 0 && (currentStatus.rows[0].is_locked as number) === 1;
        
        // Toggle lock status
        const newLockStatus = isCurrentlyLocked ? 0 : 1;
        await turso.execute(`UPDATE workshop_settings SET is_locked = ${newLockStatus}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`);

        const message = newLockStatus === 1 
            ? "Workshop locked successfully." 
            : "Workshop unlocked successfully. New proposals can now be created.";

        return new Response(JSON.stringify({ 
            success: true, 
            message,
            is_locked: newLockStatus === 1
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({ error: "Database error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

