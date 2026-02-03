import { RequestHandler } from "express";
import { db, generateId } from "../db";

interface Goal {
    id: string;
    text: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
    archived: boolean;
}

// GET all goals (non-archived)
export const getAllGoals: RequestHandler = (req, res) => {
    try {
        const goals = db
            .prepare("SELECT * FROM goals WHERE archived = 0 ORDER BY created_at DESC")
            .all() as Goal[];
        res.json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ error: "Failed to fetch goals" });
    }
};

// GET single goal
export const getGoal: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;
        const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(id) as Goal;

        if (!goal) {
            return res.status(404).json({ error: "Goal not found" });
        }

        res.json(goal);
    } catch (error) {
        console.error("Error fetching goal:", error);
        res.status(500).json({ error: "Failed to fetch goal" });
    }
};

// CREATE new goal
export const createGoal: RequestHandler = (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string") {
            return res.status(400).json({ error: "Text is required" });
        }

        const id = generateId();
        const stmt = db.prepare(
            "INSERT INTO goals (id, text, completed) VALUES (?, ?, ?)"
        );

        stmt.run(id, text, 0);

        const newGoal = db.prepare("SELECT * FROM goals WHERE id = ?").get(id) as Goal;
        res.status(201).json(newGoal);
    } catch (error) {
        console.error("Error creating goal:", error);
        res.status(500).json({ error: "Failed to create goal" });
    }
};

// UPDATE goal
export const updateGoal: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;

        const updates: string[] = [];
        const values: any[] = [];

        if (text !== undefined) {
            updates.push("text = ?");
            values.push(text);
        }

        if (completed !== undefined) {
            updates.push("completed = ?");
            values.push(completed ? 1 : 0);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No updates provided" });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        values.push(id);

        const stmt = db.prepare(
            `UPDATE goals SET ${updates.join(", ")} WHERE id = ?`
        );

        const result = stmt.run(...values);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Goal not found" });
        }

        const updatedGoal = db.prepare("SELECT * FROM goals WHERE id = ?").get(id) as Goal;
        res.json(updatedGoal);
    } catch (error) {
        console.error("Error updating goal:", error);
        res.status(500).json({ error: "Failed to update goal" });
    }
};

// DELETE goal (soft delete - archive)
export const deleteGoal: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;

        const stmt = db.prepare(
            "UPDATE goals SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        );

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Goal not found" });
        }

        res.json({ message: "Goal archived successfully" });
    } catch (error) {
        console.error("Error deleting goal:", error);
        res.status(500).json({ error: "Failed to delete goal" });
    }
};

// GET archived goals
export const getArchivedGoals: RequestHandler = (req, res) => {
    try {
        const goals = db
            .prepare("SELECT * FROM goals WHERE archived = 1 ORDER BY updated_at DESC")
            .all() as Goal[];
        res.json(goals);
    } catch (error) {
        console.error("Error fetching archived goals:", error);
        res.status(500).json({ error: "Failed to fetch archived goals" });
    }
};
