// React import not needed with new JSX transform
import { Moon, Sun, Monitor } from "lucide-react";

import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all",
            "hover:bg-background hover:text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            theme === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
          title={`Switch to ${label} theme`}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function ThemeToggleCompact() {
  const { theme, setTheme, actualTheme } = useTheme();

  const handleToggle = () => {
    if (theme === "system") {
      setTheme(actualTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center justify-center rounded-md p-2 text-sm font-medium transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
      title={`Switch to ${actualTheme === "dark" ? "light" : "dark"} theme`}
    >
      {actualTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
