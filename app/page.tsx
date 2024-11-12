"use client";

import { useState } from "react";
import {
  User,
  Menu,
  Book,
  PlayCircle,
  FileText,
  Code,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProfilePage from "@/components/ProfilePage";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Introduction");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    {
      title: "Introduction",
      icon: Book,
      content:
        "Welcome to Auth from Lolland. This authentication service provides secure and easy-to-implement solutions for your applications.",
    },
    {
      title: "Getting Started",
      icon: PlayCircle,
      content:
        "To get started with Auth from Lolland, first sign up for an account and obtain your API keys. Then, integrate our SDK into your application.",
    },
    {
      title: "Authentication",
      icon: FileText,
      content:
        "Learn about our authentication methods including OAuth 2.0, JWT, and Multi-factor Authentication. Each method is designed to provide robust security for your users.",
    },
    {
      title: "API Reference",
      icon: Code,
      content:
        "Explore our comprehensive API documentation. This section provides detailed information about endpoints, request/response formats, and authentication flows.",
    },
    {
      title: "Examples",
      icon: Menu,
      content:
        "Check out these examples of Auth from Lolland in action. We provide code snippets and full projects demonstrating integration in various programming languages and frameworks.",
    },
  ];

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Auth from Lolland</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowProfile(true)}
        >
          <User className="w-6 h-6" />
          <span className="sr-only">User profile</span>
        </Button>
      </header>
      <div className="flex flex-grow">
        <nav
          className={`border-r flex-shrink-0 transition-all duration-300 ${isSidebarMinimized ? "w-16" : "w-64"}`}
        >
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarMinimized ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-7rem)]">
            <TooltipProvider>
              {tabs.map((tab) => (
                <Tooltip key={tab.title} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-4 py-2 ${
                        activeTab === tab.title
                          ? "bg-muted hover:bg-muted"
                          : "hover:bg-transparent hover:underline"
                      }`}
                      onClick={() => setActiveTab(tab.title)}
                    >
                      <tab.icon className="mr-2 w-5 h-5" />
                      {!isSidebarMinimized && <span>{tab.title}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-50">
                    {tab.title}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </ScrollArea>
        </nav>
        <main className="overflow-auto flex-grow p-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold">{activeTab}</h2>
            <p className="text-muted-foreground">
              {tabs.find((tab) => tab.title === activeTab)?.content}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
