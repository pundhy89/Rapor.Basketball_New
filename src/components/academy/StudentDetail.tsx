import { useMemo, useState } from "react";
import { useAcademy } from "@/lib/academy-store";
import {
  ATTENDANCE_WEIGHT,
  PILLARS,
  computeReport,
  grade,
  type PillarKey,
  type Student,
} from "@/lib/academy-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const PERIODS = [
  { key: "1m", label: "1 Bln", days: 30 },
  { key: "3m", label: "3 Bln", days: 90 },
  { key: "6m", label: "6 Bln", days: 180 },
  { key: "1y", label: "1 Thn", days: 365 },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

export function StudentDetail({
  student,
  open,
  onOpenChange,
}: {
  student: Student | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { assessments, attendance, coaches } = useAcademy();
  const [period, setPeriod] = useState<PeriodKey>("3m");

  const cutoff = useMemo(() => {
    const p = PERIODS.find((p) => p.key === period)!;
    const d = new Date();
    d.setDate(d.getDate() - p.days);
    return d.toISOString().slice(0, 10);
  }, [period]);

  const data = useMemo(() => {
    if (!student) return null;
    const inRange = <T extends { date: string; studentId: string }>(arr: T[]) =>
      arr.filter((r) => r.studentId === student.id && r.date >= cutoff);
    const a = inRange(assessments);
    const at = inRange(attendance);
    const report = computeReport(student.id, a, at);

    // trend: split window in half, compare average final composite
    const midDate = new Date(cutoff);
    const now = new Date();
    const mid = new Date((midDate.getTime() + now.getTime()) / 2).toISOString().slice(0, 10);
    const firstHalf = a.filter((x) => x.date < mid);
    const secondHalf = a.filter((x) => x.date >= mid);
    const avgOf = (list: typeof a) => {
      if (!list.length) return 0;
      let sum = 0;
      for (const p of PILLARS) {
        const vals = list.map((x) => x.scores[p.key as PillarKey]);
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
        sum += avg * p.weight;
      }
      return sum;
    };
    const trendDelta = avgOf(secondHalf) - avgOf(firstHalf);

    const timeline = [...a, ...at.map((x) => ({ ...x, kind: "att" as const }))].sort((x, y) =>
      y.date.localeCompare(x.date),
    );

    return { assessments: a, attendance: at, report, trendDelta, timeline };
  }, [student, assessments, attendance, cutoff]);

  const coachName = (id?: string) => coaches.find((c) => c.id === id)?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{student?.name}</DialogTitle>
        </DialogHeader>

        {!student || !data ? null : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {student.className}
              {student.jersey ? ` · #${student.jersey}` : ""}
            </p>

            <div className="flex gap-1.5">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={cn(
                    "flex-1 rounded-full border px-2 py-1.5 text-xs font-bold transition-all",
                    period === p.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-court-gradient p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80">Nilai Akhir</p>
                  <p className="text-4xl font-black">{data.report.finalScore.toFixed(1)}</p>
                  <p className="text-[10px] font-bold uppercase opacity-90">
                    Grade {grade(data.report.finalScore).letter} ·{" "}
                    {grade(data.report.finalScore).label}
                  </p>
                </div>
                <TrendBadge delta={data.trendDelta} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="Pilar" value={data.report.pillarScore.toFixed(1)} />
                <Mini label="Kehadiran" value={`${data.report.attendanceRate.toFixed(0)}%`} />
                <Mini label="Sesi" value={data.report.totalSessions} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold">Rata Pilar</h3>
              {PILLARS.map((p) => {
                const v = data.report.pillarAverages[p.key];
                return (
                  <div key={p.key}>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-semibold">{p.label}</span>
                      <span className="font-black tabular-nums">{v.toFixed(1)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min(100, v)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold">Data Kehadiran & Penilaian</h3>
              {data.timeline.length === 0 && (
                <p className="rounded-xl bg-muted p-3 text-center text-xs text-muted-foreground">
                  Belum ada data pada periode ini.
                </p>
              )}
              <ul className="divide-y divide-border rounded-xl border border-border">
                {data.timeline.map((r) => {
                  if ("kind" in r) {
                    return (
                      <li key={r.id} className="flex flex-col gap-1 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold">Absensi · {r.status}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {r.date}
                              {coachName(r.coachId) ? ` · ${coachName(r.coachId)}` : ""}
                            </p>
                          </div>
                          <span className="text-xs font-black text-primary tabular-nums">
                            {ATTENDANCE_WEIGHT[r.status]}
                          </span>
                        </div>
                        {r.reason && (
                          <p className="text-[10px] italic text-muted-foreground">
                            Alasan: {r.reason}
                          </p>
                        )}
                      </li>
                    );
                  }
                  const w = PILLARS.reduce(
                    (s, p) => s + r.scores[p.key as PillarKey] * p.weight,
                    0,
                  );
                  return (
                    <li key={r.id} className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold">Penilaian Pilar</p>
                          <p className="text-[10px] text-muted-foreground">
                            {r.date}
                            {coachName(r.coachId) ? ` · ${coachName(r.coachId)}` : ""}
                          </p>
                        </div>
                        <span className="text-xs font-black text-primary tabular-nums">
                          {w.toFixed(1)}
                        </span>
                      </div>
                      {r.note && (
                        <p className="mt-1 border-l-2 border-primary/30 pl-2 text-[10px] italic text-muted-foreground">
                          "{r.note}"
                        </p>
                      )}
                      {r.targetNext && (
                        <p className="mt-1 border-l-2 border-accent/60 pl-2 text-[10px] font-medium text-foreground">
                          <span className="font-bold opacity-80">Target:</span> {r.targetNext}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/15 p-2 backdrop-blur">
      <p className="text-lg font-black leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase opacity-85">{label}</p>
    </div>
  );
}

function TrendBadge({ delta }: { delta: number }) {
  const Icon = delta > 1 ? TrendingUp : delta < -1 ? TrendingDown : Minus;
  const tone = delta > 1 ? "bg-success/25" : delta < -1 ? "bg-destructive/30" : "bg-white/15";
  return (
    <div className={cn("flex flex-col items-center rounded-xl p-2 backdrop-blur", tone)}>
      <Icon className="h-5 w-5" />
      <span className="mt-0.5 text-[10px] font-bold tabular-nums">
        {delta >= 0 ? "+" : ""}
        {delta.toFixed(1)}
      </span>
    </div>
  );
}
