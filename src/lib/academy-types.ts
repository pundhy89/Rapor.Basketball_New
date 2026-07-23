export const CLASSES = ["SD Lower", "SD Berkembang", "SD Upper", "SMP", "SMA"] as const;
export type ClassLevel = (typeof CLASSES)[number];

export const PILLARS = [
  { key: "technical", label: "Technical Skill", weight: 0.3 },
  { key: "tactical", label: "Tactical Understanding", weight: 0.2 },
  { key: "physical", label: "Physical Development", weight: 0.2 },
  { key: "mental", label: "Mental Development", weight: 0.15 },
  { key: "character", label: "Character & Teamwork", weight: 0.15 },
] as const;
export type PillarKey = (typeof PILLARS)[number]["key"];

export const SUB_SKILLS: Record<PillarKey, readonly string[]> = {
  technical: ["Dribbling", "Passing", "Shooting", "Finishing", "Footwork"],
  tactical: ["1-on-1", "Spacing", "Decision Making", "Offense", "Defense"],
  physical: ["Speed", "Agility", "Strength", "Power", "Endurance", "Mobility"],
  mental: ["Discipline", "Confidence", "Focus", "Leadership", "Resilience"],
  character: ["Respect", "Responsibility", "Communication", "Teamwork", "Sportsmanship"],
};

export const RATING_MAX = 5;

export function categoryOf(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Excellent", color: "text-success" };
  if (score >= 80) return { label: "Good", color: "text-primary" };
  if (score >= 70) return { label: "Fair", color: "text-warning" };
  if (score >= 60) return { label: "Needs Work", color: "text-warning" };
  return { label: "Poor", color: "text-destructive" };
}

export const ATTENDANCE = ["Hadir", "Izin", "Sakit", "Alpha"] as const;
export type AttendanceStatus = (typeof ATTENDANCE)[number];

export const ATTENDANCE_WEIGHT: Record<AttendanceStatus, number> = {
  Hadir: 100,
  Izin: 80,
  Sakit: 80,
  Alpha: 0,
};

export interface Coach {
  id: string;
  coachId?: string;
  name: string;
  role?: string;
  photoUrl?: string;
  phone?: string;
  certification?: string;
  classes?: ClassLevel[];
  isActive?: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  className: ClassLevel;
  jersey?: string;
  photoUrl?: string;
  nis?: string;
  birthDate?: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  scores: Record<PillarKey, number>; // 0-100
  note?: string;
  coachId?: string;
  targetNext?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  coachId?: string;
  reason?: string;
}

export interface StudentReport {
  studentId: string;
  pillarAverages: Record<PillarKey, number>;
  pillarScore: number; // weighted 0-100
  attendanceRate: number; // 0-100 weighted (Hadir=100, Izin/Sakit=80, Alpha=0)
  finalScore: number; // pillarScore*0.9 + attendanceRate*0.1
  totalSessions: number;
  presentCount: number;
  izinCount: number;
  sakitCount: number;
  alphaCount: number;
  assessmentCount: number;
}

export function computeReport(
  studentId: string,
  assessments: Assessment[],
  attendance: AttendanceRecord[],
): StudentReport {
  const mine = assessments.filter((a) => a.studentId === studentId);
  const att = attendance.filter((a) => a.studentId === studentId);

  const pillarAverages = {} as Record<PillarKey, number>;
  for (const p of PILLARS) {
    const vals = mine.map((a) => a.scores[p.key]).filter((v) => typeof v === "number");
    pillarAverages[p.key] = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  }
  const pillarScore = PILLARS.reduce((sum, p) => sum + pillarAverages[p.key] * p.weight, 0);

  const presentCount = att.filter((a) => a.status === "Hadir").length;
  const izinCount = att.filter((a) => a.status === "Izin").length;
  const sakitCount = att.filter((a) => a.status === "Sakit").length;
  const alphaCount = att.filter((a) => a.status === "Alpha").length;
  const total = att.length;
  const attendanceRate = total
    ? att.reduce((sum, a) => sum + ATTENDANCE_WEIGHT[a.status], 0) / total
    : 0;

  const finalScore = pillarScore * 0.9 + attendanceRate * 0.1;

  return {
    studentId,
    pillarAverages,
    pillarScore,
    attendanceRate,
    finalScore,
    totalSessions: total,
    presentCount,
    izinCount,
    sakitCount,
    alphaCount,
    assessmentCount: mine.length,
  };
}

export function grade(score: number): { letter: string; label: string; color: string } {
  if (score >= 90) return { letter: "A", label: "Excellent", color: "text-success" };
  if (score >= 80) return { letter: "B", label: "Good", color: "text-primary" };
  if (score >= 70) return { letter: "C", label: "Fair", color: "text-warning" };
  if (score >= 60) return { letter: "D", label: "Needs Work", color: "text-warning" };
  return { letter: "E", label: "Poor", color: "text-destructive" };
}
