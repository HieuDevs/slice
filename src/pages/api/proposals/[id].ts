
import type { APIRoute } from "astro";
import { getTurso } from "../../../db/turso";
import { getAuthenticatedUser } from "../../../utils/auth";

export const prerender = false;

export const PUT: APIRoute = async ({ request, params }) => {
    const { id } = params;
    
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const { username, role } = user;

    try {
        const turso = getTurso();
        // Check if proposal is selected (cannot edit selected proposals)
        const proposalCheck = await turso.execute({
            sql: "SELECT username, status FROM app_proposals WHERE id = ?",
            args: [id!]
        });

        if (proposalCheck.rows.length === 0) {
            return new Response(JSON.stringify({ error: "Proposal not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const proposalStatus = proposalCheck.rows[0].status as string;
        const proposalOwner = proposalCheck.rows[0].username as string;

        // Cannot edit selected proposals
        if (proposalStatus === "selected") {
            return new Response(JSON.stringify({ error: "Cannot edit selected proposal." }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Enforce Lock Check: locked if there's a selected proposal AND workshop is locked
        const selectedCheck = await turso.execute("SELECT id FROM app_proposals WHERE status = 'selected' LIMIT 1");
        const hasSelected = selectedCheck.rows.length > 0;
        const workshopLockCheck = await turso.execute("SELECT is_locked FROM workshop_settings WHERE id = 1");
        const workshopLocked = workshopLockCheck.rows.length > 0 && (workshopLockCheck.rows[0].is_locked as number) === 1;
        if (hasSelected && workshopLocked) {
            return new Response(JSON.stringify({ error: "Workshop is locked. Cannot edit proposals." }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await request.json();
        const { app_name, description } = data;

        if (!app_name || !description) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Only allow update if user is owner OR user is admin
        if (proposalOwner !== username && role !== "admin") {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        await turso.execute({
            sql: "UPDATE app_proposals SET app_name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            args: [app_name, description, id!]
        });

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

export const DELETE: APIRoute = async ({ request, params }) => {
    const { id } = params;
    
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const { username, role } = user;

    try {
        const turso = getTurso();
        // Check if proposal is selected (cannot delete selected proposals)
        const proposalCheck = await turso.execute({
            sql: "SELECT username, status FROM app_proposals WHERE id = ?",
            args: [id!]
        });

        if (proposalCheck.rows.length === 0) {
            return new Response(JSON.stringify({ error: "Proposal not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const proposalStatus = proposalCheck.rows[0].status as string;
        const proposalOwner = proposalCheck.rows[0].username as string;

        // Cannot delete selected proposals
        if (proposalStatus === "selected") {
            return new Response(JSON.stringify({ error: "Cannot delete selected proposal." }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Enforce Lock Check: locked if there's a selected proposal AND workshop is locked
        const selectedCheck = await turso.execute("SELECT id FROM app_proposals WHERE status = 'selected' LIMIT 1");
        const hasSelected = selectedCheck.rows.length > 0;
        const workshopLockCheck = await turso.execute("SELECT is_locked FROM workshop_settings WHERE id = 1");
        const workshopLocked = workshopLockCheck.rows.length > 0 && (workshopLockCheck.rows[0].is_locked as number) === 1;
        if (hasSelected && workshopLocked) {
            return new Response(JSON.stringify({ error: "Workshop is locked. Cannot delete proposals." }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Only allow delete if user is owner OR user is admin
        if (proposalOwner !== username && role !== "admin") {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        await turso.execute({
            sql: "DELETE FROM app_proposals WHERE id = ?",
            args: [id!]
        });

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
