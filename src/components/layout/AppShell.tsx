import type { ReactNode } from "react";
import type { AppView } from "../../App";

type AppShellProps = {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  children: ReactNode;
};

const navItems: Array<{ id: AppView; label: string; icon: ReactNode }> = [
  { id: "agenda", label: "Agenda", icon: <span className="inline-icon">A</span> },
  { id: "students", label: "Students", icon: <span className="inline-icon">S</span> },
  { id: "subjects", label: "Subjects", icon: <span className="inline-icon">T</span> },
  { id: "settings", label: "Settings", icon: <span className="inline-icon">G</span> },
];

export function AppShell({ activeView, onViewChange, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CS</span>
          <div>
            <strong>Class Scheduler</strong>
            <span>Personal teaching agenda</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={item.id === activeView ? "nav-button active" : "nav-button"}
              key={item.id}
              onClick={() => onViewChange(item.id)}
              type="button"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
