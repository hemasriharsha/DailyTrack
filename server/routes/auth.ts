import { RequestHandler } from "express";
import { getDb, generateId } from "../db";
import bcrypt from "bcryptjs";

interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string | null;
    created_at: string;
    updated_at: string;
}

interface Session {
    id: string;
    user_id: string;
    token: string;
    expires_at: string;
    created_at: string;
}

// Register new user
export const register: RequestHandler = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = getDb()
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email) as User | undefined;

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const userId = generateId();
        getDb()
            .prepare(
                "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
            )
            .run(userId, email, passwordHash, name || null);

        // Create session
        const sessionId = generateId();
        const token = generateId() + generateId(); // Extra long token
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        getDb()
            .prepare(
                "INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)"
            )
            .run(sessionId, userId, token, expiresAt.toISOString());

        const user = getDb()
            .prepare("SELECT id, email, name, created_at FROM users WHERE id = ?")
            .get(userId);

        res.status(201).json({
            user,
            token,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
};

// Login user
export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = getDb()
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email) as User | undefined;

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Create session
        const sessionId = generateId();
        const token = generateId() + generateId();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        getDb()
            .prepare(
                "INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)"
            )
            .run(sessionId, user.id, token, expiresAt.toISOString());

        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
        };

        res.json({
            user: userResponse,
            token,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Failed to login" });
    }
};

// Logout user
export const logout: RequestHandler = (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (token) {
            getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ error: "Failed to logout" });
    }
};

// Get current user
export const getCurrentUser: RequestHandler = (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Find session
        const session = getDb()
            .prepare("SELECT * FROM sessions WHERE token = ?")
            .get(token) as Session | undefined;

        if (!session) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Check if session expired
        if (new Date(session.expires_at) < new Date()) {
            getDb().prepare("DELETE FROM sessions WHERE id = ?").run(session.id);
            return res.status(401).json({ error: "Session expired" });
        }

        // Get user
        const user = getDb()
            .prepare("SELECT id, email, name, created_at FROM users WHERE id = ?")
            .get(session.user_id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error getting current user:", error);
        res.status(500).json({ error: "Failed to get current user" });
    }
};

// Middleware to verify authentication
export const requireAuth: RequestHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const session = getDb()
            .prepare("SELECT * FROM sessions WHERE token = ?")
            .get(token) as Session | undefined;

        if (!session) {
            return res.status(401).json({ error: "Invalid token" });
        }

        if (new Date(session.expires_at) < new Date()) {
            getDb().prepare("DELETE FROM sessions WHERE id = ?").run(session.id);
            return res.status(401).json({ error: "Session expired" });
        }

        // Attach user ID to request
        (req as any).userId = session.user_id;
        next();
    } catch (error) {
        console.error("Error verifying auth:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
};
