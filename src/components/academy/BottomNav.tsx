import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  UserCog,
  FileBarChart2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type Tab =
  "dashboard" | "students" | "assess" | "coaches" | "report" | "curriculum" | "settings";

const tabs: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "students", label: "Siswa", icon: Users },
  { id: "assess", label: "Sesi", icon: ClipboardCheck },
  { id: "coaches", label: "Coach", icon: UserCog },
  { id: "report", label: "Rapor", icon: FileBarChart2 },
  { id: "curriculum", label: "Kurikulum", icon: BookOpen },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex w-full max-w-md items-center justify-between rounded-2xl bg-card border border-border px-2 py-2 shadow-xl pointer-events-auto relative">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 z-10 outline-none tap-highlight-transparent",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={t.label}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="activeTabCircle"
                    className="absolute bg-orange-500 rounded-xl w-12 h-12 shadow-lg border-4 border-card"
                    style={{ top: "-18px" }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  initial={false}
                  animate={{ y: isActive ? -18 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="relative z-20 flex items-center justify-center w-full h-full"
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
