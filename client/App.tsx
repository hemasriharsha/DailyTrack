import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { DataProvider } from "./context/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Today from "./pages/Today";
import Goals from "./pages/Goals";
import Notes from "./pages/Notes";
import Habits from "./pages/Habits";
import Archive from "./pages/Archive";
import SettingsPage from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <PreferencesProvider>
      <DataProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/today" element={<Today />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </DataProvider>
    </PreferencesProvider>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
