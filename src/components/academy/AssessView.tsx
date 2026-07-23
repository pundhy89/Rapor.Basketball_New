import { useMemo, useState } from "react";
import { saveSession, useAcademy } from "@/lib/academy-store";
import {
  ATTENDANCE,
  PILLARS,
  RATING_MAX,
  SUB_SKILLS,
  categoryOf,
  type AttendanceStatus,
  type ClassLevel,
  type PillarKey,
} from "@/lib/academy-types";
import { ClassFilter } from "./ClassFilter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ChevronLeft, Star } from "lucide-react";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Hadir: "bg-success text-success-foreground border-success",
  Izin: "bg-warning text-warning-foreground border-warning",
  Sakit: "bg-primary text-primary-foreground border-primary",
  Alpha: "bg-destructive text-destructive-foreground border-destructive",
};

type Ratings = Record<PillarKey, Record<string, number>>;

function makeInitialRatings(): Ratings {
  const out = {} as Ratings;
  for (const p of PILLARS) {
    out[p.key] = Object.fromEntries(SUB_SKILLS[p.key].map((s) => [s, 0]));
  }
  return out;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: RATING_MAX }).map((_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            className="p-0.5"
            aria-label={`${n} bintang`}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                active ? "fill-primary text-primary" : "text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function AssessView({ onBack }: { onBack?: () => void }) {
  const { students, coaches } = useAcademy();
  const [filter, setFilter] = useState<ClassLevel | "all">("all");
  const [studentId, setStudentId] = useState<string>("");
  const [coachId, setCoachId] = useState<string>("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<AttendanceStatus>("Hadir");
  const [reason, setReason] = useState("");
  const [ratings, setRatings] = useState<Ratings>(() => makeInitialRatings());
  const [note, setNote] = useState("");
  const [targetNext, setTargetNext] = useState("");

  const list = useMemo(
    () => students.filter((s) => (filter === "all" ? true : s.className === filter)),
    [students, filter],
  );

  const showScoreForm = status === "Hadir";

  // Pillar scores: (sum/max)*100
  const pillarScores = useMemo(() => {
    const out = {} as Record<PillarKey, number>;
    for (const p of PILLARS) {
      const subs = SUB_SKILLS[p.key];
      const sum = subs.reduce((acc, s) => acc + (ratings[p.key][s] ?? 0), 0);
      const max = subs.length * RATING_MAX;
      out[p.key] = max ? (sum / max) * 100 : 0;
    }
    return out;
  }, [ratings]);

  // Nilai harian = Jumlah(pilar_i × weight_i)
  const dailyScore = PILLARS.reduce((s, p) => s + pillarScores[p.key] * p.weight, 0);
  const category = categoryOf(dailyScore);

  const setRating = (pillar: PillarKey, sub: string, v: number) =>
    setRatings((r) => ({ ...r, [pillar]: { ...r[pillar], [sub]: v } }));

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-black">Sesi Harian</h1>
          <p className="text-xs text-muted-foreground">
            Absensi + Penilaian 5 pilar (rating bintang)
          </p>
        </div>
      </header>

      <ClassFilter value={filter} onChange={setFilter} />

      <Card className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Siswa</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih..." />
              </SelectTrigger>
              <SelectContent>
                {list.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · {s.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Tanggal</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Coach Penilai (opsional)</Label>
          <Select value={coachId} onValueChange={setCoachId}>
            <SelectTrigger>
              <SelectValue placeholder={coaches.length ? "Pilih coach..." : "Belum ada coach"} />
            </SelectTrigger>
            <SelectContent>
              {coaches.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                  {c.role ? ` · ${c.role}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Status Kehadiran</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {ATTENDANCE.map((st) => {
              const active = status === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={cn(
                    "rounded-lg border py-2 text-xs font-bold transition-all",
                    active
                      ? STATUS_STYLES[st]
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {showScoreForm ? (
          <>
            <div className="space-y-4">
              {PILLARS.map((p, idx) => {
                const subs = SUB_SKILLS[p.key];
                const score = pillarScores[p.key];
                return (
                  <div
                    key={p.key}
                    className="space-y-2 rounded-xl border border-border bg-card/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black">
                          {idx + 1}. {p.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Bobot {(p.weight * 100).toFixed(0)}% · (Σ rating ÷ maks) × 100
                        </div>
                      </div>
                      <span className="text-xl font-black text-primary tabular-nums">
                        {score.toFixed(0)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {subs.map((sub) => (
                        <div key={sub} className="flex items-center justify-between">
                          <span className="text-xs">{sub}</span>
                          <StarRating
                            value={ratings[p.key][sub] ?? 0}
                            onChange={(v) => setRating(p.key, sub, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-muted p-2 text-center text-[10px] text-muted-foreground">
              1. Perlu banyak bimbingan, 2. Mulai berkembang, 3. Cukup / sesuai target, 4. Baik, 5.
              Sangat baik.
            </div>

            <div className="rounded-2xl bg-secondary p-4 text-secondary-foreground">
              <div className="mb-3 space-y-1">
                {PILLARS.map((p) => (
                  <div key={p.key} className="flex justify-between text-[11px]">
                    <span className="opacity-80">
                      {p.label} × {(p.weight * 100).toFixed(0)}%
                    </span>
                    <span className="font-bold tabular-nums">
                      {(pillarScores[p.key] * p.weight).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-baseline justify-between border-t border-secondary-foreground/20 pt-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">
                    Nilai Harian
                  </div>
                  <div className={cn("text-xs font-bold", category.color)}>{category.label}</div>
                </div>
                <span className="text-4xl font-black text-primary tabular-nums">
                  {dailyScore.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Catatan Coach (opsional)</Label>
              <Textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Highlight sesi hari ini..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Target latihan berikutnya (opsional)</Label>
              <Textarea
                rows={2}
                value={targetNext}
                onChange={(e) => setTargetNext(e.target.value)}
                placeholder="Fokus latihan..."
              />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="rounded-xl bg-muted p-3 text-center text-xs text-muted-foreground">
              Siswa <b>{status}</b> — penilaian pilar dilewati.
            </p>
            <div className="space-y-1.5">
              <Label>Alasan (opsional)</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Alasan ${status.toLowerCase()}...`}
              />
            </div>
          </div>
        )}

        <Button
          className="w-full"
          disabled={!studentId}
          onClick={() => {
            saveSession({
              studentId,
              date,
              status,
              coachId: coachId || undefined,
              scores: showScoreForm ? pillarScores : undefined,
              note: note.trim() || undefined,
              targetNext: showScoreForm ? targetNext.trim() || undefined : undefined,
              reason: showScoreForm ? undefined : reason.trim() || undefined,
            });
            toast.success(showScoreForm ? "Absensi & penilaian tersimpan" : "Absensi tersimpan");
            setNote("");
            setTargetNext("");
            setReason("");
            setRatings(makeInitialRatings());
          }}
        >
          Simpan Sesi
        </Button>
      </Card>
    </div>
  );
}
