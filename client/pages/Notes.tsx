import { useState } from 'react';
import { Plus, X, Trash2, BookOpen, Search, Pin } from 'lucide-react';
import { Card, CardHeader } from '@/components/Card';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Notes() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Ideas',
      content: 'Ideas for upcoming projects:\n• Design system improvements\n• Performance optimization\n• User feedback implementation',
      category: 'work',
      pinned: true,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-02-01'),
    },
    {
      id: '2',
      title: 'Learning Resources',
      content: 'Great resources for learning TypeScript:\n• Official TypeScript handbook\n• Advanced types patterns\n• Real-world examples',
      category: 'learning',
      pinned: false,
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-25'),
    },
    {
      id: '3',
      title: 'Daily Reflections',
      content: 'Today was productive. Completed the design phase of the project and got great feedback from the team.',
      category: 'personal',
      pinned: false,
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01'),
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const filteredNotes = notes
    .filter(n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      category: 'general',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
    setEditingNote(newNote);
    setShowNewForm(false);
  };

  const handleUpdateNote = (updates: Partial<Note>) => {
    if (!editingNote) return;
    const updated = { ...editingNote, ...updates, updatedAt: new Date() };
    setEditingNote(updated);
    setNotes(notes.map(n => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote === id) {
      setSelectedNote(null);
      setEditingNote(null);
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes(notes.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
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
        <div className="flex h-full">
          {/* Notes List */}
          <div className="w-72 border-r border-border bg-card flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <button
                onClick={handleCreateNote}
                className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={18} />
                New Note
              </button>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-3 py-2 bg-secondary border border-border rounded-lg outline-none focus:border-accent text-sm"
                />
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No notes yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredNotes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note.id);
                        setEditingNote(note);
                      }}
                      className={`w-full text-left p-4 hover:bg-secondary transition-colors ${
                        selectedNote === note.id ? 'bg-secondary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate flex-1">{note.title}</h3>
                        {note.pinned && <Pin size={16} className="text-accent flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {note.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Note Editor */}
          <div className="flex-1 flex flex-col bg-background">
            {editingNote ? (
              <>
                {/* Editor Header */}
                <div className="border-b border-border p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) => handleUpdateNote({ title: e.target.value })}
                      className="text-3xl font-bold text-foreground bg-transparent outline-none w-full mb-2"
                      placeholder="Note title..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Updated {editingNote.updatedAt.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePin(editingNote.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        editingNote.pinned ? 'bg-accent/10 text-accent' : 'hover:bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Pin size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(editingNote.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-3xl">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <select
                        value={editingNote.category}
                        onChange={(e) => handleUpdateNote({ category: e.target.value })}
                        className="px-3 py-2 text-sm bg-secondary border border-border rounded-lg outline-none focus:border-accent"
                      >
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="learning">Learning</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    <textarea
                      value={editingNote.content}
                      onChange={(e) => handleUpdateNote({ content: e.target.value })}
                      className="w-full min-h-96 p-4 bg-white border border-border rounded-lg outline-none focus:border-accent text-foreground placeholder-muted-foreground resize-none"
                      placeholder="Start typing your note..."
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
                  <p className="text-muted-foreground mb-4">No note selected</p>
                  <button
                    onClick={handleCreateNote}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Create your first note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
