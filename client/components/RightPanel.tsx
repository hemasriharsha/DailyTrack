import { Clock, Target, Flame } from "lucide-react";

interface RightPanelProps {
  completedGoals: number;
  totalGoals: number;
  focusMinutes?: number;
  streakDays?: number;
}

export function RightPanel({
  completedGoals,
  totalGoals,
  focusMinutes = 45,
  streakDays = 12,
}: RightPanelProps) {
  const progressPercent =
    totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <aside className="w-64 bg-card border-l border-border p-6 space-y-6 overflow-y-auto hidden lg:flex lg:flex-col">
      {/* Daily Progress */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Daily Progress
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Goals Completed
              </span>
              <span className="text-sm font-semibold text-foreground">
                {completedGoals}/{totalGoals}
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Timer Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Focus Timer</p>
            <p className="text-2xl font-bold text-gray-900">{focusMinutes}m</p>
          </div>
        </div>
        <button className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
          Start Session
        </button>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white">
            <Flame size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900">
              {streakDays} days
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Stats
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Total Goals</span>
            </div>
            <span className="font-semibold text-foreground">{totalGoals}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
