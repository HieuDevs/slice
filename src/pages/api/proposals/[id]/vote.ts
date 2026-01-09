
import type { APIRoute } from "astro";
import { getTurso } from "../../../../db/turso";
import { getAuthenticatedUser } from "../../../../utils/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
    const { id } = params;
    
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const { username } = user;

    try {
        const turso = getTurso();
        // Check if workshop is locked: locked if there's a selected proposal AND workshop is locked
        const selectedCheck = await turso.execute("SELECT id FROM app_proposals WHERE status = 'selected' LIMIT 1");
        const hasSelected = selectedCheck.rows.length > 0;
        const workshopLockCheck = await turso.execute("SELECT is_locked FROM workshop_settings WHERE id = 1");
        const workshopLocked = workshopLockCheck.rows.length > 0 && (workshopLockCheck.rows[0].is_locked as number) === 1;
        if (hasSelected && workshopLocked) {
            return new Response(JSON.stringify({ error: "Workshop is locked. Cannot vote." }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await request.json();
        const { score } = data;

        if (score === undefined || score < 0 || score > 100) {
            return new Response(JSON.stringify({ error: "Invalid score (must be 0-100)" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Insert or Replace vote
        await turso.execute({
            sql: `
        INSERT INTO votes (proposal_id, username, score) 
        VALUES (?, ?, ?) 
        ON CONFLICT(proposal_id, username) 
        DO UPDATE SET score = excluded.score, created_at = CURRENT_TIMESTAMP
      `,
            args: [id!, username, score]
        });

        return new Response(JSON.stringify({ success: true, score }), {
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
