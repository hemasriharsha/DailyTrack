import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: "short-term" | "long-term" | "habit";
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate?: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  frequency: "daily" | "weekly";
  streak: number;
  longestStreak: number;
  totalCompletions: number;
  completedToday: boolean;
  lastCompletedDate?: Date;
  completionDates: string[];
}

export interface DailyNote {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  goals: Goal[];
  habits: Habit[];
  notes: DailyNote[];
  updateGoals: (goals: Goal[]) => void;
  updateHabits: (habits: Habit[]) => void;
  updateNotes: (notes: DailyNote[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_GOALS: Goal[] = [];
const DEFAULT_HABITS: Habit[] = [];
const DEFAULT_NOTES: DailyNote[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem("app-goals");
    return stored ? JSON.parse(stored) : DEFAULT_GOALS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem("app-habits");
    return stored ? JSON.parse(stored) : DEFAULT_HABITS;
  });

  const [notes, setNotes] = useState<DailyNote[]>(() => {
    const stored = localStorage.getItem("app-notes");
    return stored ? JSON.parse(stored) : DEFAULT_NOTES;
  });

  useEffect(() => {
    localStorage.setItem("app-goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("app-habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("app-notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <DataContext.Provider
      value={{
        goals,
        habits,
        notes,
        updateGoals: setGoals,
        updateHabits: setHabits,
        updateNotes: setNotes,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
