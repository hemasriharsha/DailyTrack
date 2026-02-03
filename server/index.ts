import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  getArchivedGoals,
} from "./routes/goals";
import {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "./routes/habits";
import {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getArchivedNotes,
} from "./routes/notes";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Goals Routes
  app.get("/api/goals", getAllGoals);
  app.get("/api/goals/archived", getArchivedGoals);
  app.get("/api/goals/:id", getGoal);
  app.post("/api/goals", createGoal);
  app.put("/api/goals/:id", updateGoal);
  app.delete("/api/goals/:id", deleteGoal);

  // Habits Routes
  app.get("/api/habits", getAllHabits);
  app.post("/api/habits", createHabit);
  app.put("/api/habits/:id", updateHabit);
  app.delete("/api/habits/:id", deleteHabit);
  app.post("/api/habits/:id/toggle", toggleHabitCompletion);

  // Notes Routes
  app.get("/api/notes", getAllNotes);
  app.get("/api/notes/archived", getArchivedNotes);
  app.get("/api/notes/:id", getNote);
  app.post("/api/notes", createNote);
  app.put("/api/notes/:id", updateNote);
  app.delete("/api/notes/:id", deleteNote);

  return app;
}

