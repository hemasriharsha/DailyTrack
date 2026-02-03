import path from "path";
import fs from "fs";
import type Database from "better-sqlite3";

let dbInstance: Database.Database | null = null;

// Lazy-load database to avoid loading native bindings during build
export function getDb(): Database.Database {
    if (!dbInstance) {
        // Only require better-sqlite3 when actually needed (runtime, not build time)
        const DatabaseConstructor = require("better-sqlite3");

        const dbPath = path.join(process.cwd(), "data", "dailytracker.db");
        const dataDir = path.dirname(dbPath);

        // Ensure data directory exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        dbInstance = new DatabaseConstructor(dbPath);

        // Enable foreign keys
        dbInstance.pragma("foreign_keys = ON");

        // Initialize schema
        initializeDatabase();
    }

    return dbInstance;
}

// For backward compatibility - proxy to lazy-loaded db
export const db = new Proxy({} as Database.Database, {
    get(target, prop) {
        return getDb()[prop as keyof Database.Database];
    }
});

// Initialize schema
function initializeDatabase() {
    try {
        const schemaPath = path.join(process.cwd(), "server", "db", "schema.sql");
        const schema = fs.readFileSync(schemaPath, "utf-8");
        getDb().exec(schema);
        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Error initializing database:", error);
        throw error;
    }
}

// Helper function to generate unique IDs
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
