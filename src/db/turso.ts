import { createClient, type Client } from "@libsql/client";
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "astro:env/server";

let tursoClient: Client | null = null;

function getTursoClient(): Client {
    if (tursoClient) return tursoClient;
    
    if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
        throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in environment variables");
    }
    
    tursoClient = createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN,
    });
    
    return tursoClient;
}

export function getTurso(): Client {
    return getTursoClient();
}

export interface AppProposal {
    id: number;
    username: string;
    app_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    username: string;
    password: string;
    role: "admin" | "user";
    created_at: string;
    updated_at: string;
}

// Helper functions for users
export async function getUserFromDB(username: string): Promise<User | null> {
    try {
        const turso = getTurso();
        const result = await turso.execute({
            sql: "SELECT * FROM users WHERE username = ?",
            args: [username]
        });

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            id: row.id as number,
            username: row.username as string,
            password: row.password as string,
            role: row.role as "admin" | "user",
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
        };
    } catch (error) {
        console.error("Error getting user from database:", error);
        return null;
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const turso = getTurso();
        const result = await turso.execute({
            sql: "SELECT * FROM users WHERE id = ?",
            args: [id]
        });

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            id: row.id as number,
            username: row.username as string,
            password: row.password as string,
            role: row.role as "admin" | "user",
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
        };
    } catch (error) {
        console.error("Error getting user by id from database:", error);
        return null;
    }
}

export async function getUserRole(username: string | null): Promise<"admin" | "user" | null> {
    if (!username) return null;
    const user = await getUserFromDB(username);
    return user ? user.role : null;
}

export async function getUserRoleById(id: number | null): Promise<"admin" | "user" | null> {
    if (!id) return null;
    const user = await getUserById(id);
    return user ? user.role : null;
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const turso = getTurso();
        const result = await turso.execute("SELECT * FROM users ORDER BY created_at DESC");
        return result.rows.map((row: any) => ({
            id: row.id as number,
            username: row.username as string,
            password: row.password as string,
            role: row.role as "admin" | "user",
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
        }));
    } catch (error) {
        console.error("Error getting all users:", error);
        return [];
    }
}

export async function createUser(username: string, password: string, role: "admin" | "user" = "user"): Promise<User | null> {
    try {
        const turso = getTurso();
        await turso.execute({
            sql: "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            args: [username, password, role]
        });

        return await getUserFromDB(username);
    } catch (error: any) {
        if (error.message?.includes("UNIQUE constraint") || error.message?.includes("already exists")) {
            throw new Error("Username already exists");
        }
        console.error("Error creating user:", error);
        throw error;
    }
}

export async function deleteUserById(id: number): Promise<boolean> {
    try {
        if (!tursoClient) {
            console.error("Database client not initialized");
            return false;
        }

        const result = await tursoClient.execute({
            sql: "DELETE FROM users WHERE id = ?",
            args: [id],
        });

        return result.rowsAffected > 0;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}
