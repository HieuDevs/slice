import type { APIRoute } from "astro";
import { getUserFromDB } from "../../../db/turso";
import { createToken } from "../../../utils/jwt";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return new Response(
                JSON.stringify({ error: "Username and password are required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const user = await getUserFromDB(username);

        if (!user || user.password !== password) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Create JWT token with user id
        const token = await createToken(user.id);

        return new Response(
            JSON.stringify({
                success: true,
                token,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};

