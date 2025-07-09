import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { Header } from "./header";

interface User {
  email?: string;
  sub?: string;
  org_name?: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User;
  className?: string;
}

export function MainLayout({ children, user, className }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header user={user} onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />

      <main className={cn("container mx-auto px-4 py-8", className)}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
