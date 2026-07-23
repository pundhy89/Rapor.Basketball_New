import { useMemo, useState, useRef } from "react";
import { useAcademy } from "@/lib/academy-store";
import { PILLARS, computeReport, grade, type ClassLevel } from "@/lib/academy-types";
import { ClassFilter } from "./ClassFilter";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toJpeg } from "html-to-image";

import {
  ChevronLeft,
  Trophy,
  Download,
  Dribbble,
  Waypoints,
  Zap,
  Brain,
  Handshake,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  IdCard,
  User,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportView({ onBack }: { onBack?: () => void }) {
  const { students, assessments, attendance, logoUrl } = useAcademy();
  const [filter, setFilter] = useState<ClassLevel | "all">("all");
  const [studentId, setStudentId] = useState<string>(students[0]?.id ?? "");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () => students.filter((s) => (filter === "all" ? true : s.className === filter)),
    [students, filter],
  );

  const student = students.find((s) => s.id === studentId) ?? list[0];
  const report = useMemo(
    () => (student ? computeReport(student.id, assessments, attendance) : null),
    [student, assessments, attendance],
  );

  const studentRank = useMemo(() => {
    if (!student) return null;
    const inClass = students.filter((s) => s.className === student.className);
    const withScores = inClass.map((s) => {
      const rep = computeReport(s.id, assessments, attendance);
      return { id: s.id, score: rep.finalScore };
    });
    withScores.sort((a, b) => b.score - a.score);
    const idx = withScores.findIndex((x) => x.id === student.id);
    return idx !== -1 ? idx + 1 : null;
  }, [student, students, assessments, attendance]);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toJpeg(reportRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `Raport_${student?.name.replace(/\s+/g, "_") || "Siswa"}.jpeg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image", err);
    } finally {
      setIsExporting(false);
    }
  };

  const getPillarIcon = (key: string) => {
    switch (key) {
      case "technical":
        return <Dribbble className="h-5 w-5" />;
      case "tactical":
        return <Waypoints className="h-5 w-5" />;
      case "physical":
        return <Zap className="h-5 w-5" />;
      case "mental":
        return <Brain className="h-5 w-5" />;
      case "character":
        return <Handshake className="h-5 w-5" />;
      default:
        return <Dribbble className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4 pb-24">
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
          <h1 className="text-2xl font-black">Rapor Individual</h1>
          <p className="text-xs text-muted-foreground">Pilar 90% + Kehadiran 10%</p>
        </div>
      </header>

      <ClassFilter value={filter} onChange={setFilter} />

      <div className="space-y-1.5">
        <Label>Siswa</Label>
        <Select value={student?.id ?? ""} onValueChange={setStudentId}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih siswa" />
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

      {!student || !report ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">Tidak ada siswa.</Card>
      ) : (
        <>
          <div className="flex justify-end">
            <Button
              onClick={handleDownload}
              disabled={isExporting}
              className="gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Menyimpan..." : "Download JPEG"}
            </Button>
          </div>

          {/* Rapor Canvas Wrapper */}
          <div className="w-full flex justify-center pb-8 overflow-x-auto">
            <div
              ref={reportRef}
              className="w-[420px] shrink-0 bg-white relative overflow-hidden rounded-xl border shadow-sm mx-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {/* Header Art */}
              <div className="absolute top-0 inset-x-0 h-40 bg-[url('https://www.transparenttextures.com/patterns/basketball.png')] opacity-5 pointer-events-none" />

              <div className="relative pt-10 px-5 pb-5 flex flex-col items-center">
                <div className="flex flex-col items-center text-center z-10 mb-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-20 w-20 object-contain mb-3" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-slate-900 border-[3px] border-orange-500 flex items-center justify-center text-orange-500 shrink-0 shadow-md mb-3">
                      <Dribbble className="h-10 w-10" />
                    </div>
                  )}
                  <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-none">
                    RAPORT E-DIGITAL
                  </h1>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1.5">
                    Dragons Basketball Academy
                  </p>
                </div>
              </div>

              <div className="px-5 pb-6 space-y-5 relative z-10">
                {/* Student Profile Card */}
                <div className="relative rounded-[24px] bg-[#0a0a0a] overflow-hidden shadow-lg border-b-[6px] border-b-black">
                  {studentRank && studentRank <= 3 && report.finalScore > 0 && (
                    <div className="absolute top-0 right-0 bg-transparent z-10">
                      <div className="relative border-b-[1.5px] border-l-[1.5px] border-white/20 bg-[#1a1a1a] px-4 py-2 rounded-bl-[16px] rounded-tr-[24px] flex flex-col items-center justify-center">
                        <p className="font-bold text-[8px] tracking-widest leading-tight text-slate-300 uppercase">
                          Peringkat
                        </p>
                        <p className="font-black text-[12px] tracking-widest leading-tight text-white uppercase mt-0.5">
                          TOP {studentRank}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-5 relative z-10">
                    <div className="flex gap-4">
                      {/* Photo */}
                      <div className="w-[105px] h-[140px] shrink-0 bg-gradient-to-b from-slate-200 to-[#5a5a5a] rounded-[16px] border border-white/20 relative overflow-hidden shadow-inner">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-100">
                            <User className="h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8 text-center z-10">
                          <p className="font-black text-[10px] italic tracking-wider text-slate-200 drop-shadow">
                            DRAGONS
                          </p>
                        </div>
                      </div>

                      {/* Name & Grid */}
                      <div className="flex-1 flex flex-col min-w-0 pr-12">
                        <div className="pt-1">
                          <h2 className="text-[19px] font-black uppercase text-white leading-none truncate">
                            {student.name}
                          </h2>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                            {student.className}
                          </p>
                        </div>

                        {/* Grid Info */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-auto pb-1">
                          <div className="flex items-center gap-2 border border-white/20 rounded-full bg-white/5 p-1.5">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-slate-300">
                              <IdCard className="h-3 w-3" />
                            </div>
                            <div className="min-w-0 pr-1">
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                NIS
                              </p>
                              <p className="font-bold text-slate-200 text-[9px] truncate leading-tight mt-0.5">
                                {student.nis || "DRB-0000"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 border border-white/20 rounded-full bg-white/5 p-1.5">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-slate-300">
                              <User className="h-3 w-3" />
                            </div>
                            <div className="min-w-0 pr-1">
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                Usia
                              </p>
                              <p className="font-bold text-slate-200 text-[9px] truncate leading-tight mt-0.5">
                                {student.birthDate
                                  ? `${new Date().getFullYear() - new Date(student.birthDate).getFullYear()} Tahun`
                                  : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 border border-white/20 rounded-full bg-white/5 p-1.5">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-slate-300">
                              <LayoutGrid className="h-3 w-3" />
                            </div>
                            <div className="min-w-0 pr-1">
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                Kelas
                              </p>
                              <p className="font-bold text-slate-200 text-[9px] truncate leading-tight mt-0.5">
                                {student.className}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 border border-white/20 rounded-full bg-white/5 p-1.5">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-slate-300">
                              <Calendar className="h-3 w-3" />
                            </div>
                            <div className="min-w-0 pr-1">
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                Tahun/Semester
                              </p>
                              <p className="font-bold text-slate-200 text-[9px] truncate leading-tight mt-0.5">
                                24/25 - SEM 1
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="mt-4 flex items-baseline justify-center gap-3">
                      <span className="text-[52px] font-black text-[#ea580c] leading-none tracking-tighter drop-shadow-sm">
                        {report.finalScore.toFixed(1)}
                      </span>
                      <span className="text-[16px] font-black text-white tracking-widest uppercase">
                        GRADE {grade(report.finalScore).letter}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5 Pillars */}
                <div className="pt-4 pb-2 relative">
                  <h3 className="text-[15px] font-black text-slate-900 tracking-wider uppercase mb-5">
                    5 PILAR PERFORMA
                  </h3>

                  {/* Faint basketball hoop watermark on the right */}
                  <div className="absolute right-0 top-10 bottom-0 w-32 opacity-[0.03] pointer-events-none flex items-center justify-end overflow-hidden">
                    <Dribbble className="w-48 h-48 translate-x-12" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    {PILLARS.map((p) => {
                      const val = report.pillarAverages[p.key];
                      return (
                        <div key={p.key} className="flex items-center gap-4">
                          <div className="shrink-0 text-[#d97706]">{getPillarIcon(p.key)}</div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span className="font-bold text-slate-800 text-[12px] truncate mb-1.5">
                              {p.label}
                            </span>
                            <div className="flex items-center">
                              <div className="h-1.5 overflow-hidden bg-slate-200 w-full">
                                <div
                                  className="h-full bg-[#ea580c]"
                                  style={{ width: `${Math.min(100, val)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 w-12 text-right">
                            <span className="text-[14px] font-black text-slate-800">
                              {val > 0 ? val.toFixed(1) : "-"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-slate-200 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-500 tracking-widest uppercase">
                      NILAI PILAR (90%)
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {report.pillarScore.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="pt-2 pb-2">
                  <h3 className="text-[15px] font-black text-slate-900 tracking-wider uppercase mb-5">
                    RINGKASAN KEHADIRAN
                  </h3>

                  <div className="grid grid-cols-4 gap-3">
                    <AttCard label="Hadir" value={report.presentCount} color="text-[#10b981]" />
                    <AttCard label="Izin" value={report.izinCount} color="text-[#eab308]" />
                    <AttCard label="Sakit" value={report.sakitCount} color="text-[#ef4444]" />
                    <AttCard label="Alpha" value={report.alphaCount} color="text-[#9f1239]" />
                  </div>

                  <div className="mt-5 text-center">
                    <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                      <span>{report.totalSessions} Sesi</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span>{report.attendanceRate.toFixed(0)}% Hadir (10%)</span>
                    </p>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="flex flex-col items-center justify-center pt-8 pb-2 relative">
                  <div className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-4 text-center z-10">
                    TANGGAL TERBIT:{" "}
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex flex-col items-center">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        className="h-24 w-24 object-contain absolute opacity-[0.03] z-0 top-0 grayscale"
                      />
                    )}
                    <div className="h-10 flex items-center justify-center z-10">
                      <span className="font-['Brush_Script_MT',cursive] text-2xl text-slate-800 italic">
                        Signature
                      </span>
                    </div>
                    <div className="w-32 h-[1.5px] bg-slate-300 mb-1 z-10" />
                    <p className="text-[9px] font-bold text-orange-500 tracking-widest uppercase z-10">
                      HEAD COACH
                    </p>
                    <p className="font-bold text-slate-800 text-[11px] mt-0.5 z-10">
                      Andri Setiawan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AttCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[16px] border-[2px] border-slate-900 bg-white py-3 flex flex-col items-center justify-center text-center shadow-sm">
      <p className="text-[34px] font-black leading-none text-slate-900 mt-1">{value}</p>
      <p className={cn("mt-2 text-[9px] font-black uppercase tracking-widest", color)}>{label}</p>
    </div>
  );
}
