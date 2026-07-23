import { useEffect, useSyncExternalStore } from "react";
import type {
  Assessment,
  AttendanceRecord,
  AttendanceStatus,
  Coach,
  Schedule,
  Student,
} from "./academy-types";

const KEY = "hoop-academy-v2";
const GAS_KEY = "hoop-academy-gas-url";

export interface AcademyState {
  schedules: Schedule[];
  students: Student[];
  coaches: Coach[];
  assessments: Assessment[];
  attendance: AttendanceRecord[];
  logoUrl?: string;
  theme?: "light" | "dark";
}

function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const initial: AcademyState = {
  schedules: [],
  students: [
    {
      id: "s1",
      name: "Rafi Pratama",
      className: "SD Upper",
      jersey: "7",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s2",
      name: "Bima Saputra",
      className: "SMP",
      jersey: "12",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s3",
      name: "Kevin Wijaya",
      className: "SMA",
      jersey: "23",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s4",
      name: "Arka Nugroho",
      className: "SD Lower",
      jersey: "3",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s5",
      name: "Dimas Ardiansyah",
      className: "SD Berkembang",
      jersey: "9",
      createdAt: new Date().toISOString(),
    },
  ],
  coaches: [
    { id: "c1", name: "Coach Andre", role: "Head Coach", createdAt: new Date().toISOString() },
    { id: "c2", name: "Coach Ryan", role: "Assistant", createdAt: new Date().toISOString() },
  ],
  assessments: [
    {
      id: "a1",
      studentId: "s1",
      date: today(-2),
      scores: { technical: 82, tactical: 75, physical: 80, mental: 78, character: 88 },
      coachId: "c1",
    },
    {
      id: "a2",
      studentId: "s1",
      date: today(-1),
      scores: { technical: 85, tactical: 78, physical: 82, mental: 80, character: 90 },
      coachId: "c1",
    },
    {
      id: "a3",
      studentId: "s2",
      date: today(-1),
      scores: { technical: 70, tactical: 72, physical: 75, mental: 74, character: 80 },
      coachId: "c2",
    },
    {
      id: "a4",
      studentId: "s3",
      date: today(-1),
      scores: { technical: 90, tactical: 88, physical: 85, mental: 82, character: 92 },
      coachId: "c1",
    },
  ],
  attendance: [
    { id: "at1", studentId: "s1", date: today(-2), status: "Hadir", coachId: "c1" },
    { id: "at2", studentId: "s1", date: today(-1), status: "Hadir", coachId: "c1" },
    { id: "at3", studentId: "s2", date: today(-2), status: "Sakit", coachId: "c2" },
    { id: "at4", studentId: "s2", date: today(-1), status: "Hadir", coachId: "c2" },
    { id: "at5", studentId: "s3", date: today(-1), status: "Hadir", coachId: "c1" },
    { id: "at6", studentId: "s4", date: today(-1), status: "Izin", coachId: "c1" },
    { id: "at7", studentId: "s5", date: today(-1), status: "Alpha", coachId: "c2" },
  ],
};

let state: AcademyState = initial;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch (e) {
    /* ignore */
  }
}
function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
  syncToGas().catch(() => {});
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function getSnapshot(): AcademyState {
  return state;
}
export function getServerSnapshot(): AcademyState {
  return initial;
}

export function useAcademy() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    load();
    listeners.forEach((l) => l());
  }, []);
  return s;
}

// ---------- Student ----------
export function addStudent(s: Omit<Student, "id" | "createdAt">) {
  state = {
    ...state,
    students: [
      ...state.students,
      { ...s, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ],
  };
  persist();
}
export function updateStudent(id: string, s: Partial<Omit<Student, "id" | "createdAt">>) {
  state = {
    ...state,
    students: state.students.map((student) => (student.id === id ? { ...student, ...s } : student)),
  };
  persist();
}
export function deleteStudent(id: string) {
  state = {
    ...state,
    students: state.students.filter((s) => s.id !== id),
    assessments: state.assessments.filter((a) => a.studentId !== id),
    attendance: state.attendance.filter((a) => a.studentId !== id),
  };
  persist();
}

// ---------- Coach ----------
export function addCoach(c: Omit<Coach, Schedule, "id" | "createdAt">) {
  state = {
    ...state,
    coaches: [
      ...state.coaches,
      { ...c, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ],
  };
  persist();
}
export function updateCoach(id: string, c: Partial<Omit<Coach, Schedule, "id" | "createdAt">>) {
  state = {
    ...state,
    coaches: state.coaches.map((coach) => (coach.id === id ? { ...coach, ...c } : coach)),
  };
  persist();
}
export function deleteCoach(id: string) {
  state = { ...state, coaches: state.coaches.filter((c) => c.id !== id) };
  persist();
}

// ---------- Schedule ----------
export function addSchedule(payload: Omit<Schedule, "id" | "createdAt">) {
  const s: Schedule = {
    ...payload,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  };
  state = { ...state, schedules: [...state.schedules, s] };
  persist();
}

export function updateSchedule(id: string, payload: Partial<Schedule>) {
  state = {
    ...state,
    schedules: state.schedules.map((s) => (s.id === id ? { ...s, ...payload } : s)),
  };
  persist();
}

export function deleteSchedule(id: string) {
  state = { ...state, schedules: state.schedules.filter((s) => s.id !== id) };
  persist();
}

// ---------- Settings ----------
export function setLogoUrl(url: string) {
  state = { ...state, logoUrl: url };
  persist();
}

export function setTheme(theme: "light" | "dark") {
  state = { ...state, theme };
  persist();
}

// ---------- Assessment + Attendance combined ----------
export function addAssessment(a: Omit<Assessment, "id">) {
  state = { ...state, assessments: [...state.assessments, { ...a, id: crypto.randomUUID() }] };
  persist();
}

export function setAttendance(
  studentId: string,
  date: string,
  status: AttendanceStatus,
  coachId?: string,
  reason?: string,
) {
  const existing = state.attendance.find((r) => r.studentId === studentId && r.date === date);
  if (existing) {
    state = {
      ...state,
      attendance: state.attendance.map((r) =>
        r.id === existing.id
          ? { ...r, status, coachId: coachId ?? r.coachId, reason: reason ?? r.reason }
          : r,
      ),
    };
  } else {
    state = {
      ...state,
      attendance: [
        ...state.attendance,
        { id: crypto.randomUUID(), studentId, date, status, coachId, reason },
      ],
    };
  }
  persist();
}

/** Save assessment + attendance in one operation. */
export function saveSession(input: {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  scores?: Assessment["scores"];
  note?: string;
  coachId?: string;
  reason?: string;
  targetNext?: string;
}) {
  const { studentId, date, status, scores, note, coachId, reason, targetNext } = input;
  setAttendance(studentId, date, status, coachId, reason);
  if (scores && status === "Hadir") {
    addAssessment({ studentId, date, scores, note, coachId, targetNext });
  }
}

// ---------- Google Apps Script sync ----------
export function getGasUrl(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GAS_KEY) ?? "";
}
export function setGasUrl(url: string) {
  localStorage.setItem(GAS_KEY, url);
}
async function syncToGas() {
  const url = getGasUrl();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "sync", payload: state }),
    });
  } catch (e) {
    /* ignore */
  }
}
export async function pullFromGas(): Promise<boolean> {
  const url = getGasUrl();
  if (!url) return false;
  try {
    const res = await fetch(`${url}?action=pull`);
    const data = (await res.json()) as Partial<AcademyState>;
    state = { ...state, ...data };
    persist();
    return true;
  } catch {
    return false;
  }
}
