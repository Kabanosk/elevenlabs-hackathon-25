import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React from "react";
import Finished from './pages/Finished';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" forcedTheme="dark">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/finished" element={<Finished />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;