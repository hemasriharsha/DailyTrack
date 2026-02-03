import { useState } from 'react';
import { Plus, X, Zap, Flame, TrendingUp } from 'lucide-react';
import { Card, CardHeader } from '@/components/Card';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';

interface Habit {
  id: string;
  name: string;
  color: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  longestStreak: number;
  totalCompletions: number;
  completedToday: boolean;
  lastCompletedDate?: Date;
  completionDates: string[];
}

const colors = [
  { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  { name: 'green', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
];

export default function Habits() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Exercise',
      color: 'green',
      frequency: 'daily',
      streak: 15,
      longestStreak: 45,
      totalCompletions: 67,
      completedToday: true,
      completionDates: [],
    },
    {
      id: '2',
      name: 'Read for 20 mins',
      color: 'blue',
      frequency: 'daily',
      streak: 8,
      longestStreak: 25,
      totalCompletions: 42,
      completedToday: false,
      completionDates: [],
    },
    {
      id: '3',
      name: 'Meditate',
      color: 'purple',
      frequency: 'daily',
      streak: 12,
      longestStreak: 12,
      totalCompletions: 34,
      completedToday: true,
      completionDates: [],
    },
    {
      id: '4',
      name: 'Drink 8 glasses of water',
      color: 'orange',
      frequency: 'daily',
      streak: 5,
      longestStreak: 20,
      totalCompletions: 28,
      completedToday: true,
      completionDates: [],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', color: 'blue', frequency: 'daily' as const });

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          ...newHabit,
          streak: 0,
          longestStreak: 0,
          totalCompletions: 0,
          completedToday: false,
          completionDates: [],
        },
      ]);
      setNewHabit({ name: '', color: 'blue', frequency: 'daily' });
      setShowForm(false);
    }
  };

  const handleToggleHabit = (id: string) => {
    setHabits(
      habits.map(h => {
        if (h.id === id) {
          const newStreak = h.completedToday ? Math.max(0, h.streak - 1) : h.streak + 1;
          const newLongestStreak = Math.max(h.longestStreak, newStreak);
          return {
            ...h,
            completedToday: !h.completedToday,
            streak: newStreak,
            longestStreak: newLongestStreak,
            totalCompletions: h.completedToday ? h.totalCompletions - 1 : h.totalCompletions + 1,
          };
        }
        return h;
      })
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getColorClasses = (colorName: string) => {
    return colors.find(c => c.name === colorName) || colors[0];
  };

  const completedToday = habits.filter(h => h.completedToday).length;

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
                <Zap size={36} />
                Habit Tracker
              </h1>
              <p className="text-muted-foreground mt-2">
                {completedToday} of {habits.length} habits completed today
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus size={20} />
              New Habit
            </button>
          </div>

          {/* Today Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Zap size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed Today</p>
                  <p className="text-3xl font-bold text-foreground">{completedToday}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Flame size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Habits</p>
                  <p className="text-3xl font-bold text-foreground">{habits.length}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Completions</p>
                  <p className="text-3xl font-bold text-foreground">
                    {habits.reduce((sum, h) => sum + h.totalCompletions, 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Add Habit Form */}
          {showForm && (
            <Card className="mb-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Habit name..."
                  className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg outline-none focus:border-accent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">Frequency</label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                      className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg outline-none focus:border-accent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">Color</label>
                    <select
                      value={newHabit.color}
                      onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg outline-none focus:border-accent"
                    >
                      {colors.map(c => (
                        <option key={c.name} value={c.name}>
                          {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddHabit}
                    className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Create Habit
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 bg-white border border-purple-200 text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Habits List */}
          <div className="space-y-4">
            {habits.map(habit => {
              const colorClass = getColorClasses(habit.color);
              return (
                <Card key={habit.id}>
                  <div className="space-y-4">
                    {/* Habit Title and Completion */}
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={habit.completedToday}
                        onChange={() => handleToggleHabit(habit.id)}
                        className="w-6 h-6 rounded-md border border-border cursor-pointer"
                      />
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          habit.completedToday ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {habit.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full font-medium text-sm ${colorClass.bg} ${colorClass.text}`}>
                        {habit.streak === 1 ? '1 day' : `${habit.streak} days`}
                      </div>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <X size={18} className="text-destructive" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Flame size={16} className="text-orange-500" />
                          <span className="text-xs text-muted-foreground">Current</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{habit.streak}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <TrendingUp size={16} className="text-blue-500" />
                          <span className="text-xs text-muted-foreground">Longest</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{habit.longestStreak}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Zap size={16} className="text-green-500" />
                          <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{habit.totalCompletions}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {habits.length === 0 && (
              <Card className="text-center py-12">
                <Zap size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
                <p className="text-muted-foreground mb-4">No habits yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Create your first habit
                </button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
