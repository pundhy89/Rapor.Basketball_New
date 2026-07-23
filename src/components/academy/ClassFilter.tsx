import { CLASSES, type ClassLevel } from "@/lib/academy-types";
import { cn } from "@/lib/utils";

export function ClassFilter({
  value,
  onChange,
  allowAll = true,
}: {
  value: ClassLevel | "all";
  onChange: (v: ClassLevel | "all") => void;
  allowAll?: boolean;
}) {
  const opts: (ClassLevel | "all")[] = allowAll ? ["all", ...CLASSES] : [...CLASSES];
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1">
      <div className="flex gap-2 min-w-max">
        {opts.map((c) => {
          const active = value === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground dark:text-white shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "all" ? "Semua" : c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
