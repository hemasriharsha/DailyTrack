import { RequestHandler } from "express";
import { getDb, generateId } from "../db";

interface Habit {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    completed: boolean;
    streak: number;
    created_at: string;
    updated_at: string;
    archived: boolean;
}

// GET all habits (non-archived) for current user
export const getAllHabits: RequestHandler = (req, res) => {
    try {
        const userId = (req as any).userId;
        const habits = getDb()
            .prepare("SELECT * FROM habits WHERE user_id = ? AND archived = 0 ORDER BY created_at DESC")
            .all(userId) as Habit[];
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
        const userId = (req as any).userId;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Name is required" });
        }

        const id = generateId();
        const stmt = getDb().prepare(
            "INSERT INTO habits (id, user_id, name, description, completed, streak) VALUES (?, ?, ?, ?, ?, ?)"
        );

        stmt.run(id, userId, name, description || null, 0, 0);

        const newHabit = getDb()
            .prepare("SELECT * FROM habits WHERE id = ?")
            .get(id) as Habit;
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
        const userId = (req as any).userId;

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
        values.push(id, userId);

        const stmt = getDb().prepare(
            `UPDATE habits SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`
        );

        const result = stmt.run(...values);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }

        const updatedHabit = getDb()
            .prepare("SELECT * FROM habits WHERE id = ?")
            .get(id) as Habit;
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
        const userId = (req as any).userId;

        const stmt = getDb().prepare(
            "UPDATE habits SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
        );

        const result = stmt.run(id, userId);

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
        const userId = (req as any).userId;
        const today = new Date().toISOString().split("T")[0];

        // Check if completion exists for today
        const existing = getDb()
            .prepare("SELECT * FROM habit_completions WHERE habit_id = ? AND user_id = ? AND date = ?")
            .get(id, userId, today);

        if (existing) {
            // Toggle completion
            getDb()
                .prepare(
                    "UPDATE habit_completions SET completed = NOT completed WHERE habit_id = ? AND user_id = ? AND date = ?"
                )
                .run(id, userId, today);
        } else {
            // Create new completion
            const completionId = generateId();
            getDb()
                .prepare(
                    "INSERT INTO habit_completions (id, habit_id, user_id, date, completed) VALUES (?, ?, ?, ?, ?)"
                )
                .run(completionId, id, userId, today, 1);
        }

        // Update habit's completed status
        const completion = getDb()
            .prepare("SELECT completed FROM habit_completions WHERE habit_id = ? AND user_id = ? AND date = ?")
            .get(id, userId, today) as { completed: number } | undefined;

        getDb()
            .prepare("UPDATE habits SET completed = ? WHERE id = ? AND user_id = ?")
            .run(completion?.completed || 0, id, userId);

        const updatedHabit = getDb()
            .prepare("SELECT * FROM habits WHERE id = ?")
            .get(id) as Habit;
        res.json(updatedHabit);
    } catch (error) {
        console.error("Error toggling habit completion:", error);
        res.status(500).json({ error: "Failed to toggle habit completion" });
    }
};
