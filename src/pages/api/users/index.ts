import type { APIRoute } from "astro";
import { createUser, getAllUsers, deleteUserById } from "../../../db/turso";
import { getAuthenticatedUser } from "../../../utils/auth";

export const prerender = false;

// GET: Get all users (authenticated users can view)
export const GET: APIRoute = async ({ request }) => {
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return new Response(
            JSON.stringify({ error: "Authentication required." }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const users = await getAllUsers();
        // Don't return passwords
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);

        return new Response(JSON.stringify({
            users: usersWithoutPasswords,
            isAdmin: user.role === "admin"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error getting users:", error);
        return new Response(
            JSON.stringify({ error: "Database error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};

// POST: Create new user (admin only)
export const POST: APIRoute = async ({ request }) => {
    // Get authenticated user from token
    const user = await getAuthenticatedUser(request);
    
    if (!user || user.role !== "admin") {
        return new Response(
            JSON.stringify({ error: "Forbidden. Admin access required." }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const { username: newUsername, password, role: newRole } = await request.json();

        if (!newUsername || !password) {
            return new Response(
                JSON.stringify({ error: "Username and password are required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validate username must end with @slice.com
        if (!newUsername.endsWith("@slice.com")) {
            return new Response(
                JSON.stringify({ error: "Username must end with @slice.com" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (newRole && newRole !== "admin" && newRole !== "user") {
            return new Response(
                JSON.stringify({ error: "Role must be 'admin' or 'user'" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const user = await createUser(newUsername, password, newRole || "user");

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Failed to create user" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Don't return password
        const { password: _, ...userWithoutPassword } = user;

        return new Response(
            JSON.stringify({
                success: true,
                user: userWithoutPassword,
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error.message === "Username already exists") {
            return new Response(
                JSON.stringify({ error: "Username already exists" }),
                {
                    status: 409,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        return new Response(
            JSON.stringify({ error: "Database error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};

// DELETE: Delete user (admin only)
export const DELETE: APIRoute = async ({ request }) => {
    // Get authenticated user from token
    const currentUser = await getAuthenticatedUser(request);

    if (!currentUser || currentUser.role !== "admin") {
        return new Response(
            JSON.stringify({ error: "Forbidden. Admin access required." }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("id");

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User ID is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Don't allow deleting yourself
        if (parseInt(userId) === currentUser.id) {
            return new Response(
                JSON.stringify({ error: "Cannot delete your own account" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const success = await deleteUserById(parseInt(userId));

        if (!success) {
            return new Response(
                JSON.stringify({ error: "User not found or could not be deleted" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(
            JSON.stringify({ error: "Database error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};

