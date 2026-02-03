import { useState } from "react";
import {
  Archive,
  RotateCcw,
  Trash2,
  Calendar,
  CheckSquare,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader } from "@/components/Card";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";

interface ArchivedItem {
  id: string;
  title: string;
  type: "goal" | "note" | "task";
  description?: string;
  archivedDate: Date;
  dateRange?: string;
}

export default function ArchivePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([
    {
      id: "1",
      title: "Q4 Revenue Target",
      type: "goal",
      description: "Achieve $500K quarterly revenue",
      archivedDate: new Date("2025-12-31"),
    },
    {
      id: "2",
      title: "Website Redesign",
      type: "goal",
      description: "Complete major redesign of marketing website",
      archivedDate: new Date("2025-11-15"),
    },
    {
      id: "3",
      title: "Travel Notes - Europe",
      type: "note",
      description: "Travel experiences and recommendations from European trip",
      archivedDate: new Date("2025-10-20"),
    },
    {
      id: "4",
      title: "Q3 Planning",
      type: "note",
      description: "Planning notes for Q3 initiatives",
      archivedDate: new Date("2025-09-30"),
    },
    {
      id: "5",
      title: "Annual Review Prep",
      type: "task",
      description: "Prepare documents for annual performance review",
      archivedDate: new Date("2025-08-15"),
    },
  ]);
  const [filterType, setFilterType] = useState<
    "all" | "goal" | "note" | "task"
  >("all");

  const filteredItems = archivedItems.filter(
    (item) => filterType === "all" || item.type === filterType,
  );

  const handleRestore = (id: string) => {
    setArchivedItems(archivedItems.filter((item) => item.id !== id));
  };

  const handleDelete = (id: string) => {
    setArchivedItems(archivedItems.filter((item) => item.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <CheckSquare size={20} className="text-blue-600" />;
      case "note":
        return <BookOpen size={20} className="text-purple-600" />;
      case "task":
        return <Calendar size={20} className="text-orange-600" />;
      default:
        return <Archive size={20} className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "goal":
        return "Goal";
      case "note":
        return "Note";
      case "task":
        return "Task";
      default:
        return "Item";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "goal":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "note":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "task":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      <div
        className={`fixed top-16 transition-all duration-300 ${
          sidebarCollapsed ? "left-20" : "left-64"
        } right-0 bottom-0 overflow-y-auto`}
      >
        <div className="flex-1 p-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Archive size={36} />
              Archive
            </h1>
            <p className="text-muted-foreground">
              {archivedItems.length} archived{" "}
              {archivedItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(["all", "goal", "note", "task"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === type
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {type === "all" ? "All Items" : getTypeLabel(type)}
              </button>
            ))}
          </div>

          {/* Archive Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CheckSquare size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Archived Goals
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {archivedItems.filter((i) => i.type === "goal").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Archived Notes
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {archivedItems.filter((i) => i.type === "note").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Archived Tasks
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {archivedItems.filter((i) => i.type === "task").length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Archived Items List */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <Card className="text-center py-12">
                <Archive
                  size={48}
                  className="mx-auto text-muted-foreground mb-4 opacity-40"
                />
                <p className="text-muted-foreground mb-4">No archived items</p>
              </Card>
            ) : (
              filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded border ${getTypeColor(item.type)}`}
                          >
                            {getTypeLabel(item.type)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Archived{" "}
                            {item.archivedDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        title="Restore item"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                        title="Delete permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
