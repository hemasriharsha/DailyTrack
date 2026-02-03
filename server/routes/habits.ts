import { RequestHandler } from "express";
import { db, generateId } from "../db";

interface Habit {
    id: string;
    name: string;
    description: string | null;
    completed: boolean;
    streak: number;
    created_at: string;
    updated_at: string;
    archived: boolean;
}

// GET all habits (non-archived)
export const getAllHabits: RequestHandler = (req, res) => {
    try {
        const habits = db
            .prepare("SELECT * FROM habits WHERE archived = 0 ORDER BY created_at DESC")
            .all() as Habit[];
        res.json(habits);
    } catch (error) {
        console.error("Error fetching habits:", error);
        res.status(500).json({ error: "Failed to fetch habits" });
    }
};

// CREATE new habit
export const createHabit: RequestHandler = (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Name is required" });
        }

        const id = generateId();
        const stmt = db.prepare(
            "INSERT INTO habits (id, name, description, completed, streak) VALUES (?, ?, ?, ?, ?)"
        );

        stmt.run(id, name, description || null, 0, 0);

        const newHabit = db.prepare("SELECT * FROM habits WHERE id = ?").get(id) as Habit;
        res.status(201).json(newHabit);
    } catch (error) {
        console.error("Error creating habit:", error);
        res.status(500).json({ error: "Failed to create habit" });
    }
};

// UPDATE habit
export const updateHabit: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, completed, streak } = req.body;

        const updates: string[] = [];
        const values: any[] = [];

        if (name !== undefined) {
            updates.push("name = ?");
            values.push(name);
        }

        if (description !== undefined) {
            updates.push("description = ?");
            values.push(description);
        }

        if (completed !== undefined) {
            updates.push("completed = ?");
            values.push(completed ? 1 : 0);
        }

        if (streak !== undefined) {
            updates.push("streak = ?");
            values.push(streak);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No updates provided" });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        values.push(id);

        const stmt = db.prepare(
            `UPDATE habits SET ${updates.join(", ")} WHERE id = ?`
        );

        const result = stmt.run(...values);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }

        const updatedHabit = db.prepare("SELECT * FROM habits WHERE id = ?").get(id) as Habit;
        res.json(updatedHabit);
    } catch (error) {
        console.error("Error updating habit:", error);
        res.status(500).json({ error: "Failed to update habit" });
    }
};

// DELETE habit (soft delete - archive)
export const deleteHabit: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;

        const stmt = db.prepare(
            "UPDATE habits SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        );

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }

        res.json({ message: "Habit archived successfully" });
    } catch (error) {
        console.error("Error deleting habit:", error);
        res.status(500).json({ error: "Failed to delete habit" });
    }
};

// Toggle habit completion for today
export const toggleHabitCompletion: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;
        const today = new Date().toISOString().split("T")[0];

        // Check if completion exists for today
        const existing = db
            .prepare("SELECT * FROM habit_completions WHERE habit_id = ? AND date = ?")
            .get(id, today);

        if (existing) {
            // Toggle completion
            db.prepare(
                "UPDATE habit_completions SET completed = NOT completed WHERE habit_id = ? AND date = ?"
            ).run(id, today);
        } else {
            // Create new completion
            const completionId = generateId();
            db.prepare(
                "INSERT INTO habit_completions (id, habit_id, date, completed) VALUES (?, ?, ?, ?)"
            ).run(completionId, id, today, 1);
        }

        // Update habit's completed status
        const completion = db
            .prepare("SELECT completed FROM habit_completions WHERE habit_id = ? AND date = ?")
            .get(id, today) as { completed: number };

        db.prepare("UPDATE habits SET completed = ? WHERE id = ?").run(
            completion?.completed || 0,
            id
        );

        const updatedHabit = db.prepare("SELECT * FROM habits WHERE id = ?").get(id) as Habit;
        res.json(updatedHabit);
    } catch (error) {
        console.error("Error toggling habit completion:", error);
        res.status(500).json({ error: "Failed to toggle habit completion" });
    }
};
