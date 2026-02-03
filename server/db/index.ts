import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "dailytracker.db");
const schemaPath = path.join(process.cwd(), "server", "db", "schema.sql");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize schema
export function initializeDatabase() {
    try {
        const schema = fs.readFileSync(schemaPath, "utf-8");
        db.exec(schema);
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

// Initialize on import
initializeDatabase();
