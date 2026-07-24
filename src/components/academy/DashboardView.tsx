import { useMemo, useState, useEffect } from "react";
import { useAcademy, setTheme } from "@/lib/academy-store";
import { audioManager } from "@/lib/audio-manager";
import { useSyncExternalStore } from "react";
import { CLASSES, computeReport, PILLARS } from "@/lib/academy-types";
import { Card } from "@/components/ui/card";
import {
  Trophy,
  Users,
  CalendarCheck,
  Activity,
  Settings,
  Moon,
  Sun,
  CalendarDays,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { Tab } from "./BottomNav";

export function DashboardView({ onGo }: { onGo: (t: Tab) => void }) {
  const isPlaying = useSyncExternalStore((l) => audioManager.subscribe(l), () => audioManager.getIsPlaying(), () => false);
  const trackName = useSyncExternalStore((l) => audioManager.subscribe(l), () => audioManager.getCurrentTrackName(), () => "");
  const { students, assessments, attendance, logoUrl, theme } = useAcademy();
  const today = new Date().toISOString().slice(0, 10);

  const isDark = theme === "dark";

  const toggleDark = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const stats = useMemo(() => {
    const todayAtt = attendance.filter((a) => a.date === today);
    const present = todayAtt.filter((a) => a.status === "Hadir").length;
    const reports = students.map((s) => computeReport(s.id, assessments, attendance));
    const avgFinal = reports.length
      ? reports.reduce((s, r) => s + r.finalScore, 0) / reports.length
      : 0;
    const top = [...reports].sort((a, b) => b.finalScore - a.finalScore).slice(0, 3);
    return { present, todayTotal: todayAtt.length, avgFinal, top };
  }, [students, assessments, attendance, today]);

  const byClass = CLASSES.map((c) => ({
    name: c,
    count: students.filter((s) => s.className === c).length,
  }));

  return (
    <div className="space-y-5 pt-16 relative">
      {/* Top action buttons */}

      <div className="absolute top-2 right-0 z-50">
        <button
          onClick={toggleDark}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-colors hover:bg-accent"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      <section className="relative rounded-3xl bg-hero-gradient p-5 text-primary-foreground shadow-lg flex flex-col items-center text-center">
        {logoUrl && (
          <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 drop-shadow-xl">
            <img src={logoUrl} alt="Dragons Logo" className="h-full w-full object-contain" />
          </div>
        )}
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-widest opacity-80",
            logoUrl ? "mt-20" : "mt-2",
          )}
        >
          Dragons Basketball Academy
        </p>
        <h1 className="mt-1 text-2xl font-black leading-tight">Selamat datang, Coach 🏀</h1>
        <p className="mt-1 text-sm opacity-90">Pantau progres murid atlitmu hari ini.</p>
        <div className="mt-6 w-full grid grid-cols-3 gap-2 text-left">
          <MiniStat label="Siswa" value={students.length} />
          <MiniStat label="Hadir" value={`${stats.present}/${stats.todayTotal || 0}`} />
          <MiniStat label="Rata Nilai" value={stats.avgFinal.toFixed(1)} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <QuickCard icon={Users} label="Data Siswa" onClick={() => onGo("students")} />
        <QuickCard icon={Activity} label="Sesi Harian" onClick={() => onGo("assess")} />
        <QuickCard icon={CalendarCheck} label="Data Coach" onClick={() => onGo("coaches")} />
        <QuickCard icon={Trophy} label="Rapor" onClick={() => onGo("report")} />
        <QuickCard icon={CalendarDays} label="Jadwal" onClick={() => onGo("schedule")} />
      </section>

      
      {/* Music Player widget */}
      <section>
        <Card className="p-3 mb-3 bg-secondary/50 border flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Music className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">BGM Player</p>
              <p className="truncate text-sm font-semibold">{trackName || "Loading..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button onClick={() => audioManager.playPrev()} className="p-2 hover:bg-accent rounded-full transition-colors"><SkipBack className="h-4 w-4" /></button>
            <button onClick={() => audioManager.togglePlay()} className="p-2 hover:bg-accent rounded-full bg-primary/10 text-primary transition-colors">
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            </button>
            <button onClick={() => audioManager.playNext()} className="p-2 hover:bg-accent rounded-full transition-colors"><SkipForward className="h-4 w-4" /></button>
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-bold">Distribusi Kelas</h2>
          <span className="text-xs text-muted-foreground">{students.length} siswa</span>
        </div>
        <Card className="p-4">
          <ul className="space-y-2.5">
            {byClass.map((c) => {
              const pct = students.length ? (c.count / students.length) * 100 : 0;
              return (
                <li key={c.name}>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold">🏆 Top Performer</h2>
        <div className="space-y-2">
          {stats.top.length === 0 && (
            <p className="text-xs text-muted-foreground">Belum ada penilaian.</p>
          )}
          {stats.top.map((r, i) => {
            const s = students.find((s) => s.id === r.studentId);
            if (!s) return null;
            return (
              <Card key={r.studentId} className="flex items-center gap-3 p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.className}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary">{r.finalScore.toFixed(1)}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Final</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold">5 Pilar Penilaian</h2>
        <Card className="p-4">
          <ul className="space-y-1.5 text-xs">
            {PILLARS.map((p) => (
              <li key={p.key} className="flex items-center justify-between">
                <span className="font-medium">{p.label}</span>
                <span className="rounded-md bg-accent px-2 py-0.5 font-bold text-accent-foreground">
                  {(p.weight * 100).toFixed(0)}%
                </span>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
              <span>Nilai Pilar 90% + Kehadiran 10%</span>
              <span className="font-bold text-foreground">= 100</span>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/15 px-2 py-2 text-center backdrop-blur">
      <p className="text-lg font-black leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-85">{label}</p>
    </div>
  );
}

function QuickCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
