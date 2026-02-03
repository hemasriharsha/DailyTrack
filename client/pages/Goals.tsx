import { useState } from 'react';
import { Plus, X, Trash2, Target } from 'lucide-react';
import { Card, CardHeader } from '@/components/Card';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'short-term' | 'long-term' | 'habit';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  dueDate?: string;
  completed: boolean;
}

const priorities = {
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
};

const categories = {
  'short-term': 'Short-term',
  'long-term': 'Long-term',
  habit: 'Habit Building',
};

export default function Goals() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete project launch',
      description: 'Finish all tasks for Q1 product launch',
      category: 'short-term',
      priority: 'high',
      progress: 75,
      dueDate: '2026-02-28',
      completed: false,
    },
    {
      id: '2',
      title: 'Learn TypeScript',
      description: 'Master advanced TypeScript patterns and types',
      category: 'long-term',
      priority: 'medium',
      progress: 40,
      dueDate: '2026-06-30',
      completed: false,
    },
    {
      id: '3',
      title: 'Read 12 books',
      description: 'One book per month throughout the year',
      category: 'long-term',
      priority: 'low',
      progress: 25,
      dueDate: '2026-12-31',
      completed: false,
    },
    {
      id: '4',
      title: 'Exercise daily',
      description: 'Build consistent fitness habit',
      category: 'habit',
      priority: 'high',
      progress: 60,
      completed: false,
    },
  ]);
  const [filter, setFilter] = useState<'all' | 'short-term' | 'long-term' | 'habit'>('all');
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'short-term' as const,
    priority: 'medium' as const,
  });

  const filteredGoals = goals.filter(g => filter === 'all' || g.category === filter);

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          ...newGoal,
          progress: 0,
          completed: false,
        },
      ]);
      setNewGoal({ title: '', description: '', category: 'short-term', priority: 'medium' });
      setShowForm(false);
    }
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, progress } : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : g.progress } : g)));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      <div
        className={`fixed top-16 transition-all duration-300 ${
          sidebarCollapsed ? 'left-20' : 'left-64'
        } right-0 bottom-0 overflow-y-auto`}
      >
        <div className="flex-1 p-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Target size={36} />
                Daily Goals
              </h1>
              <p className="text-muted-foreground mt-2">{goals.length} goals tracked</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus size={20} />
              New Goal
            </button>
          </div>

          {/* Add Goal Form */}
          {showForm && (
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Goal title..."
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg outline-none focus:border-accent"
                />
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Description (optional)..."
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg outline-none focus:border-accent resize-none"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="px-4 py-2 bg-white border border-blue-200 rounded-lg outline-none focus:border-accent"
                  >
                    <option value="short-term">Short-term</option>
                    <option value="long-term">Long-term</option>
                    <option value="habit">Habit Building</option>
                  </select>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                    className="px-4 py-2 bg-white border border-blue-200 rounded-lg outline-none focus:border-accent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddGoal}
                    className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Create Goal
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 bg-white border border-blue-200 text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['all', 'short-term', 'long-term', 'habit'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {f === 'all' ? 'All Goals' : categories[f]}
              </button>
            ))}
          </div>

          {/* Goals Grid */}
          <div className="space-y-4">
            {filteredGoals.map(goal => (
              <Card key={goal.id} className={goal.completed ? 'opacity-60' : ''}>
                <div className="space-y-4">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => handleToggleComplete(goal.id)}
                        className="w-5 h-5 rounded-md border border-border cursor-pointer"
                      />
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-1 rounded border bg-gray-100 text-gray-700 border-gray-200">
                      {categories[goal.category]}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${priorities[goal.priority].color}`}>
                      {priorities[goal.priority].label} Priority
                    </span>
                    {goal.dueDate && (
                      <span className="text-xs font-medium px-2 py-1 rounded border bg-purple-100 text-purple-700 border-purple-200">
                        Due: {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Progress</span>
                      <span className="text-sm font-semibold text-accent">{goal.progress}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                        className="w-32 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredGoals.length === 0 && (
              <Card className="text-center py-12">
                <Target size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
                <p className="text-muted-foreground">No goals yet in this category</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
