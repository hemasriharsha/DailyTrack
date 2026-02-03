import { useState } from "react";
import { Plus, X, Edit2, Calendar, Briefcase, Zap } from "lucide-react";
import { Card, CardHeader } from "@/components/Card";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { RightPanel } from "@/components/RightPanel";

interface Task {
  id: string;
  title: string;
  category: "work" | "personal" | "health";
  completed: boolean;
  time?: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "work":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "personal":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "health":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "work":
      return "Work";
    case "personal":
      return "Personal";
    case "health":
      return "Health";
    default:
      return "Other";
  }
};

export default function Today() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Morning standup",
      category: "work",
      completed: true,
      time: "09:00",
    },
    {
      id: "2",
      title: "Design review",
      category: "work",
      completed: false,
      time: "10:30",
    },
    {
      id: "3",
      title: "Gym session",
      category: "health",
      completed: false,
      time: "18:00",
    },
    {
      id: "4",
      title: "Team lunch",
      category: "work",
      completed: false,
      time: "12:00",
    },
    {
      id: "5",
      title: "Call dentist",
      category: "personal",
      completed: false,
      time: "14:00",
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "work" | "personal" | "health"
  >("work");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const workTasks = tasks.filter((t) => t.category === "work");
  const personalTasks = tasks.filter((t) => t.category === "personal");
  const healthTasks = tasks.filter((t) => t.category === "health");

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          category: selectedCategory,
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => handleToggleTask(task.id)}
        className="w-5 h-5 rounded-md border border-border cursor-pointer"
      />
      <div className="flex-1">
        <p
          className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
        >
          {task.title}
        </p>
        {task.time && (
          <p className="text-xs text-muted-foreground mt-1">{task.time}</p>
        )}
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded border ${getCategoryColor(task.category)}`}
      >
        {getCategoryLabel(task.category)}
      </span>
      <button
        onClick={() => handleDeleteTask(task.id)}
        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-all"
      >
        <X size={16} className="text-destructive" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      <div
        className={`fixed top-16 transition-all duration-300 ${
          sidebarCollapsed ? "left-20" : "left-64"
        } right-0 bottom-0 overflow-y-auto`}
      >
        <div className="flex h-full">
          <div className="flex-1 p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Today</h1>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>

            {/* Daily Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Work Tasks</p>
                    <p className="text-2xl font-bold text-foreground">
                      {workTasks.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Personal</p>
                    <p className="text-2xl font-bold text-foreground">
                      {personalTasks.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Zap size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Health</p>
                    <p className="text-2xl font-bold text-foreground">
                      {healthTasks.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* All Tasks */}
            <Card className="mb-8">
              <CardHeader
                title="All Tasks"
                description={`${completedCount} of ${tasks.length} completed`}
              />
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}

                {/* Add New Task */}
                <div className="pt-3 border-t border-border">
                  <div className="flex gap-2 mb-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value as any)
                      }
                      className="px-3 py-2 text-sm bg-secondary border border-border rounded-lg outline-none focus:border-accent"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Plus size={20} className="text-muted-foreground" />
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                      placeholder="Add a new task..."
                      className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder-muted-foreground"
                    />
                    <button
                      onClick={handleAddTask}
                      className="px-3 py-1 text-xs font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline View */}
            <Card>
              <CardHeader
                title="Timeline"
                description="Tasks organized by time"
              />
              <div className="space-y-4">
                {tasks
                  .filter((t) => t.time)
                  .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                  .map((task) => (
                    <div key={task.id} className="flex gap-4">
                      <div className="w-16 flex-shrink-0">
                        <p className="text-sm font-semibold text-foreground">
                          {task.time}
                        </p>
                      </div>
                      <div className="flex-1 pb-4 border-l-2 border-border pl-4 relative">
                        <div className="absolute w-3 h-3 bg-accent rounded-full -left-[7px] top-1 mt-1"></div>
                        <div className="flex items-center justify-between">
                          <span
                            className={
                              task.completed
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }
                          >
                            {task.title}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded border ${getCategoryColor(task.category)}`}
                          >
                            {getCategoryLabel(task.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          <RightPanel
            completedGoals={completedCount}
            totalGoals={tasks.length}
          />
        </div>
      </div>
    </div>
  );
}
