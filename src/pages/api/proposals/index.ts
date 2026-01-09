
import type { APIRoute } from "astro";
import { getTurso, getAllUsers } from "../../../db/turso";
import { getAuthenticatedUser } from "../../../utils/auth";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
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
        // Check global lock status: locked if there's a selected proposal AND workshop is locked
        const selectedCheck = await turso.execute("SELECT id FROM app_proposals WHERE status = 'selected' LIMIT 1");
        const hasSelected = selectedCheck.rows.length > 0;
        const workshopLockCheck = await turso.execute("SELECT is_locked FROM workshop_settings WHERE id = 1");
        const workshopLocked = workshopLockCheck.rows.length > 0 && (workshopLockCheck.rows[0].is_locked as number) === 1;
        const isLocked = hasSelected && workshopLocked;

        // Get all proposals (everyone can see all now)
        const proposalsResult = await turso.execute("SELECT * FROM app_proposals ORDER BY created_at DESC");
        const proposals = proposalsResult.rows;

        // Get total number of users (excluding admin for voting purposes, or including all)
        const allUsers = await getAllUsers();
        const totalMembers = allUsers.length;

        // Fetch ALL votes for calculating averages (needed for both admin and users)
        const allVotesResult = await turso.execute("SELECT * FROM votes");
        let allVotesMap: Record<number, any[]> = {};
        for (const row of allVotesResult.rows) {
            const pid = row.proposal_id as number;
            if (!allVotesMap[pid]) allVotesMap[pid] = [];
            allVotesMap[pid].push({ username: row.username, score: row.score });
        }

        // Fetch votes for display (admin sees all, user sees only their own)
        let votesMap: Record<number, any[]> = {};

        if (role === "admin") {
            // Admin sees ALL votes
            for (const row of allVotesResult.rows) {
                const pid = row.proposal_id as number;
                if (!votesMap[pid]) votesMap[pid] = [];
                votesMap[pid].push({ username: row.username, score: row.score });
            }
        } else {
            // User sees ONLY their vote
            const votesResult = await turso.execute({
                sql: "SELECT * FROM votes WHERE username = ?",
                args: [username!]
            });
            for (const row of votesResult.rows) {
                const pid = row.proposal_id as number;
                if (!votesMap[pid]) votesMap[pid] = [];
                votesMap[pid].push({ username: row.username, score: row.score }); // Only their own
            }
        }

        // Combine data
        const enrichedProposals = proposals.map(p => {
            const pid = p.id as number;
            const proposalVotes = votesMap[pid] || [];
            const allProposalVotes = allVotesMap[pid] || [];
            const proposalOwner = p.username as string;

            // For current user (to show their input)
            const currentUserVote = proposalVotes.find((v: any) => v.username === username)?.score ?? null;

            // Exclude proposal owner's vote when calculating average
            const votesExcludingOwner = allProposalVotes.filter((v: any) => v.username !== proposalOwner);
            const voteCount = votesExcludingOwner.length;
            
            // Total members excluding the proposal owner
            const totalMembersExcludingOwner = totalMembers - 1;
            
            // Calculate average score (excluding owner's vote)
            const averageScore = voteCount > 0
                ? votesExcludingOwner.reduce((sum: number, v: any) => sum + v.score, 0) / voteCount
                : null;
            const allMembersVoted = voteCount === totalMembersExcludingOwner;

            return {
                ...p,
                is_locked: isLocked,
                current_user_score: currentUserVote,
                votes: role === "admin" ? proposalVotes : undefined, // Only admin sees list
                average_score: averageScore !== null ? Math.round(averageScore * 100) / 100 : null, // Round to 2 decimals
                vote_count: voteCount,
                total_members: totalMembersExcludingOwner,
                all_members_voted: allMembersVoted
            };
        });

        return new Response(JSON.stringify({
            proposals: enrichedProposals,
            userRole: role,
            isAdmin: role === "admin"
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

export const POST: APIRoute = async ({ request }) => {
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
        // Enforce Lock Check: locked if there's a selected proposal AND workshop is locked
        const selectedCheck = await turso.execute("SELECT id FROM app_proposals WHERE status = 'selected' LIMIT 1");
        const hasSelected = selectedCheck.rows.length > 0;
        const workshopLockCheck = await turso.execute("SELECT is_locked FROM workshop_settings WHERE id = 1");
        const workshopLocked = workshopLockCheck.rows.length > 0 && (workshopLockCheck.rows[0].is_locked as number) === 1;
        if (hasSelected && workshopLocked) {
            return new Response(JSON.stringify({ error: "Workshop is locked. Cannot create new proposals." }), {
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

        const result = await turso.execute({
            sql: "INSERT INTO app_proposals (username, app_name, description) VALUES (?, ?, ?)",
            args: [username, app_name, description]
        });

        return new Response(JSON.stringify({
            id: result.lastInsertRowid?.toString(),
            username,
            app_name,
            description,
            success: true
        }), {
            status: 201,
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
