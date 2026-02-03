import { RequestHandler } from "express";
import { db, generateId } from "../db";

interface Note {
    id: string;
    title: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    archived: boolean;
}

// GET all notes (non-archived)
export const getAllNotes: RequestHandler = (req, res) => {
    try {
        const notes = db
            .prepare("SELECT * FROM notes WHERE archived = 0 ORDER BY updated_at DESC")
            .all() as Note[];
        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};

// GET single note
export const getNote: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;
        const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note;

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ error: "Failed to fetch note" });
    }
};

// CREATE new note
export const createNote: RequestHandler = (req, res) => {
    try {
        const { title, content } = req.body;

        if (!content || typeof content !== "string") {
            return res.status(400).json({ error: "Content is required" });
        }

        const id = generateId();
        const stmt = db.prepare(
            "INSERT INTO notes (id, title, content) VALUES (?, ?, ?)"
        );

        stmt.run(id, title || null, content);

        const newNote = db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note;
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Failed to create note" });
    }
};

// UPDATE note
export const updateNote: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updates: string[] = [];
        const values: any[] = [];

        if (title !== undefined) {
            updates.push("title = ?");
            values.push(title);
        }

        if (content !== undefined) {
            updates.push("content = ?");
            values.push(content);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No updates provided" });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        values.push(id);

        const stmt = db.prepare(
            `UPDATE notes SET ${updates.join(", ")} WHERE id = ?`
        );

        const result = stmt.run(...values);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        const updatedNote = db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as Note;
        res.json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Failed to update note" });
    }
};

// DELETE note (soft delete - archive)
export const deleteNote: RequestHandler = (req, res) => {
    try {
        const { id } = req.params;

        const stmt = db.prepare(
            "UPDATE notes SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        );

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.json({ message: "Note archived successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Failed to delete note" });
    }
};

// GET archived notes
export const getArchivedNotes: RequestHandler = (req, res) => {
    try {
        const notes = db
            .prepare("SELECT * FROM notes WHERE archived = 1 ORDER BY updated_at DESC")
            .all() as Note[];
        res.json(notes);
    } catch (error) {
        console.error("Error fetching archived notes:", error);
        res.status(500).json({ error: "Failed to fetch archived notes" });
    }
};
