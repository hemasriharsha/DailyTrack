import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  register,
  login,
  logout,
  getCurrentUser,
  requireAuth,
} from "./routes/auth";
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

  // Auth Routes (public)
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);

  // Protected Routes - All require authentication
  // Goals Routes
  app.get("/api/goals", requireAuth, getAllGoals);
  app.get("/api/goals/archived", requireAuth, getArchivedGoals);
  app.get("/api/goals/:id", requireAuth, getGoal);
  app.post("/api/goals", requireAuth, createGoal);
  app.put("/api/goals/:id", requireAuth, updateGoal);
  app.delete("/api/goals/:id", requireAuth, deleteGoal);

  // Habits Routes
  app.get("/api/habits", requireAuth, getAllHabits);
  app.post("/api/habits", requireAuth, createHabit);
  app.put("/api/habits/:id", requireAuth, updateHabit);
  app.delete("/api/habits/:id", requireAuth, deleteHabit);
  app.post("/api/habits/:id/toggle", requireAuth, toggleHabitCompletion);

  // Notes Routes
  app.get("/api/notes", requireAuth, getAllNotes);
  app.get("/api/notes/archived", requireAuth, getArchivedNotes);
  app.get("/api/notes/:id", requireAuth, getNote);
  app.post("/api/notes", requireAuth, createNote);
  app.put("/api/notes/:id", requireAuth, updateNote);
  app.delete("/api/notes/:id", requireAuth, deleteNote);

  return app;
}
