// src/components/Layout.tsx

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, LineChart, Menu, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { Analytics } from "@vercel/analytics/react"

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    { path: '/', label: 'Live Scores', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { path: '/predictions', label: 'Prediction', icon: <LineChart className="h-4 w-4 mr-2" /> },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-basketball-navy flex items-center justify-center mr-3">
              <a href='/'><Trophy className="h-6 w-6 text-white" /></a>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">March Madness Tracker</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <Tabs value={location.pathname} className="w-full">
              <TabsList className="bg-muted/50 h-10">
                {routes.map((route) => (
                  <Link 
                    key={route.path} 
                    to={route.path}
                    className="focus:outline-none"
                  >
                    <TabsTrigger 
                      value={route.path}
                      className={cn(
                        "data-[state=active]:bg-white data-[state=active]:text-basketball-navy data-[state=active]:shadow-sm",
                        "transition-all duration-200 px-6"
                      )}
                    >
                      <div className="flex items-center">
                        {route.icon}
                        {route.label}
                      </div>
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
            </Tabs>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-700 rounded-md"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? 
              <X className="h-6 w-6" /> : 
              <Menu className="h-6 w-6" />
            }
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white border-t animate-slide-down">
            <nav className="container flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "flex items-center py-2.5 px-4 rounded-md transition-colors",
                    route.path === location.pathname
                      ? "bg-basketball-navy text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.icon}
                  <span>{route.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:container">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} March Madness Tracker</p>
          <div className="mt-2">
            <a
              href="https://github.com/sidthakur08/mm-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 hover:text-gray-700"
            >
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/siddhant-thakur-data/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 hover:text-gray-700"
            >
              LinkedIn
            </a>
            <a
              href="https://sidthakur08.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 hover:text-gray-700"
            >
              Portfolio (currently improving T^T)
            </a>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
};

export default Layout;
