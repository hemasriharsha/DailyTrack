import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function Placeholder({ title, icon, description }: PlaceholderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        <div className="flex h-full items-center justify-center p-8">
          <Card className="max-w-lg text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                {icon}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground mb-6">{description}</p>
            <div className="inline-flex items-center gap-2 text-sm text-accent hover:opacity-80 transition-opacity cursor-pointer">
              Request this page
              <ArrowRight size={16} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
