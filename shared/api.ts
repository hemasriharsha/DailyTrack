/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Goal interface
 */
export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

/**
 * Habit interface
 */
export interface Habit {
  id: string;
  name: string;
  description: string | null;
  completed: boolean;
  streak: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

/**
 * Note interface
 */
export interface Note {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

/**
 * Daily Entry interface
 */
export interface DailyEntry {
  id: string;
  date: string;
  notes: string | null;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

