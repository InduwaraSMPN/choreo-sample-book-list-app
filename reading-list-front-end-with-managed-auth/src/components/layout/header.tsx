// React import not needed with new JSX transform
import Cookies from "js-cookie";
import { LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggleCompact } from "@/components/ui/theme-toggle";
// cn utility not used in this component

interface User {
  email?: string;
  sub?: string;
  org_name?: string;
}

interface HeaderProps {
  user?: User;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ user, onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const handleLogout = () => {
    sessionStorage.removeItem("userInfo");
    window.location.href = `/auth/logout?session_hint=${Cookies.get("session_hint")}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4"></div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggleCompact />
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-foreground">Welcome back!</p>
                <p className="text-muted-foreground">{user.email || user.sub}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggleCompact />
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="h-9 w-9">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-4">
            {user && (
              <>
                <div className="text-sm border-b pb-4">
                  <p className="font-medium text-foreground">Welcome back!</p>
                  <p className="text-muted-foreground">{user.email || user.sub}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
