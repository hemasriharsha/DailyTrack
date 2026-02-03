import { Goal, Habit, Note } from "@shared/api";

const API_BASE = "/api";

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: "An error occurred",
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// Goals API
export const goalsAPI = {
    getAll: () => fetchAPI<Goal[]>("/goals"),
    getArchived: () => fetchAPI<Goal[]>("/goals/archived"),
    get: (id: string) => fetchAPI<Goal>(`/goals/${id}`),
    create: (text: string) =>
        fetchAPI<Goal>("/goals", {
            method: "POST",
            body: JSON.stringify({ text }),
        }),
    update: (id: string, data: { text?: string; completed?: boolean }) =>
        fetchAPI<Goal>(`/goals/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/goals/${id}`, {
            method: "DELETE",
        }),
};

// Habits API
export const habitsAPI = {
    getAll: () => fetchAPI<Habit[]>("/habits"),
    create: (name: string, description?: string) =>
        fetchAPI<Habit>("/habits", {
            method: "POST",
            body: JSON.stringify({ name, description }),
        }),
    update: (
        id: string,
        data: {
            name?: string;
            description?: string;
            completed?: boolean;
            streak?: number;
        }
    ) =>
        fetchAPI<Habit>(`/habits/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/habits/${id}`, {
            method: "DELETE",
        }),
    toggle: (id: string) =>
        fetchAPI<Habit>(`/habits/${id}/toggle`, {
            method: "POST",
        }),
};

// Notes API
export const notesAPI = {
    getAll: () => fetchAPI<Note[]>("/notes"),
    getArchived: () => fetchAPI<Note[]>("/notes/archived"),
    get: (id: string) => fetchAPI<Note>(`/notes/${id}`),
    create: (content: string, title?: string) =>
        fetchAPI<Note>("/notes", {
            method: "POST",
            body: JSON.stringify({ content, title }),
        }),
    update: (id: string, data: { title?: string; content?: string }) =>
        fetchAPI<Note>(`/notes/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchAPI<{ message: string }>(`/notes/${id}`, {
            method: "DELETE",
        }),
};
