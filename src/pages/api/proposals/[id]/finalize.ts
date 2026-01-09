
import type { APIRoute } from "astro";
import { getTurso } from "../../../../db/turso";
import { getAuthenticatedUser } from "../../../../utils/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
    const { id } = params;
    
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);
    
    // Only admin can finalize
    if (!user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const turso = getTurso();
        // Reset all status to active first
        await turso.execute("UPDATE app_proposals SET status = 'active'");

        // Set this one to selected
        await turso.execute({
            sql: "UPDATE app_proposals SET status = 'selected' WHERE id = ?",
            args: [id!]
        });

        // Lock the workshop
        await turso.execute("UPDATE workshop_settings SET is_locked = 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1");

        return new Response(JSON.stringify({ success: true }), {
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
