import { Search, Calendar, Bell, User } from "lucide-react";
import { useState } from "react";

export function TopNav() {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border h-16 flex items-center px-6 gap-8 shadow-sm">
      {/* App Name */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <span className="text-lg font-semibold text-foreground">
          DailyTrack
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
            searchFocus
              ? "bg-white border-accent"
              : "bg-secondary border-border"
          }`}
        >
          <Search size={18} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          title="Calendar"
        >
          <Calendar size={20} />
        </button>
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground relative"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          title="Profile"
        >
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}
