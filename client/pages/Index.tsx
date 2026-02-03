import { useState } from 'react';
import { Plus, X, Edit2, Calendar, Quote } from 'lucide-react';
import { Card, CardHeader } from '@/components/Card';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { RightPanel } from '@/components/RightPanel';

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

const quotes = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Success is not final, failure is not fatal. — Winston Churchill",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "It always seems impossible until it's done. — Nelson Mandela",
];

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', text: 'Complete project design', completed: false },
    { id: '2', text: 'Review pull requests', completed: true },
    { id: '3', text: 'Team standup meeting', completed: false },
  ]);
  const [newGoal, setNewGoal] = useState('');
  const [notes, setNotes] = useState('Take notes about your day, ideas, and reflections here...');
  const [editingNotes, setEditingNotes] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Drink 8 glasses of water', completed: true },
    { id: '2', name: 'Exercise for 30 minutes', completed: false },
    { id: '3', name: 'Read for 20 minutes', completed: false },
    { id: '4', name: 'Meditate', completed: true },
  ]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const completedGoals = goals.filter((g) => g.completed).length;

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { id: Date.now().toString(), text: newGoal, completed: false }]);
      setNewGoal('');
    }
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      {/* Main Content */}
      <div
        className={`fixed top-16 transition-all duration-300 ${
          sidebarCollapsed ? 'left-20' : 'left-64'
        } right-0 bottom-0 overflow-y-auto`}
      >
        <div className="flex h-full">
          {/* Center Content */}
          <div className="flex-1 p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-foreground">Today</h1>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Calendar size={24} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>

            {/* Quote of the Day */}
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex gap-4">
                <Quote size={24} className="text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Quote of the Day</p>
                  <p className="text-blue-800 italic">{randomQuote}</p>
                </div>
              </div>
            </Card>

            {/* Today's Goals */}
            <Card className="mb-8">
              <CardHeader
                title="Today's Goals"
                description="Keep track of what you want to accomplish"
              />
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => handleToggleGoal(goal.id)}
                      className="w-5 h-5 rounded-md border border-border cursor-pointer"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        goal.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {goal.text}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-all"
                    >
                      <X size={16} className="text-destructive" />
                    </button>
                  </div>
                ))}

                {/* Add New Goal */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <Plus size={20} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    placeholder="Add a new goal..."
                    className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder-muted-foreground"
                  />
                  <button
                    onClick={handleAddGoal}
                    className="px-3 py-1 text-xs font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Add
                  </button>
                </div>
              </div>
            </Card>

            {/* Notes Section */}
            <Card className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Notes</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Capture your thoughts and ideas
                  </p>
                </div>
                <button
                  onClick={() => setEditingNotes(!editingNotes)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Edit2 size={18} className="text-muted-foreground" />
                </button>
              </div>
              {editingNotes ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-40 p-4 bg-secondary rounded-lg border border-border outline-none focus:border-accent resize-none"
                />
              ) : (
                <p className="text-foreground whitespace-pre-wrap bg-secondary p-4 rounded-lg min-h-40 flex items-center">
                  {notes}
                </p>
              )}
            </Card>

            {/* Habits */}
            <Card className="mb-8">
              <CardHeader
                title="Habits"
                description="Daily habits to build a better you"
              />
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      onChange={() => handleToggleHabit(habit.id)}
                      className="w-5 h-5 rounded-md border border-border cursor-pointer"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        habit.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {habit.name}
                    </span>
                    {habit.completed && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                        Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <RightPanel
            completedGoals={completedGoals}
            totalGoals={goals.length}
          />
        </div>
      </div>
    </div>
  );
}
