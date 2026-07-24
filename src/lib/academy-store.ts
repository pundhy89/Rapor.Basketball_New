import { useEffect, useSyncExternalStore } from "react";
import type {
  Assessment,
  AttendanceRecord,
  AttendanceStatus,
  Coach,
  Schedule,
  Student,
} from "./academy-types";

const KEY = "hoop-academy-v3";
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
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s2",
      name: "Bima Saputra",
      className: "SMP",
      jersey: "12",
      photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s3",
      name: "Kevin Wijaya",
      className: "SMA",
      jersey: "23",
      photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s4",
      name: "Arka Nugroho",
      className: "SD Lower",
      jersey: "3",
      photoUrl: "https://randomuser.me/api/portraits/men/4.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s5",
      name: "Dimas Ardiansyah",
      className: "SD Berkembang",
      jersey: "9",
      photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s6",
      name: "Satria Mahardika",
      className: "SMP",
      jersey: "14",
      photoUrl: "https://randomuser.me/api/portraits/men/6.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s7",
      name: "Rizky Aditya",
      className: "SMA",
      jersey: "11",
      photoUrl: "https://randomuser.me/api/portraits/men/7.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s8",
      name: "Fachry Albar",
      className: "SD Upper",
      jersey: "8",
      photoUrl: "https://randomuser.me/api/portraits/men/8.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s9",
      name: "Daffa Naufal",
      className: "SD Berkembang",
      jersey: "21",
      photoUrl: "https://randomuser.me/api/portraits/men/9.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s10",
      name: "Gibran Rakabuming",
      className: "SD Lower",
      jersey: "15",
      photoUrl: "https://randomuser.me/api/portraits/men/10.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s11",
      name: "Nabila Putri",
      className: "SD Upper",
      jersey: "5",
      photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s12",
      name: "Salsabila Ayu",
      className: "SMP",
      jersey: "18",
      photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s13",
      name: "Kirana Larasati",
      className: "SMA",
      jersey: "33",
      photoUrl: "https://randomuser.me/api/portraits/women/3.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s14",
      name: "Aisyah Azzahra",
      className: "SD Lower",
      jersey: "24",
      photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s15",
      name: "Rania Salsabila",
      className: "SD Berkembang",
      jersey: "10",
      photoUrl: "https://randomuser.me/api/portraits/women/5.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s16",
      name: "Farhan Maulana",
      className: "SD Upper",
      jersey: "27",
      photoUrl: "https://randomuser.me/api/portraits/men/11.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s17",
      name: "Gilang Dirga",
      className: "SMP",
      jersey: "99",
      photoUrl: "https://randomuser.me/api/portraits/men/12.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s18",
      name: "Haikal Hassan",
      className: "SMA",
      jersey: "44",
      photoUrl: "https://randomuser.me/api/portraits/men/13.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s19",
      name: "Ilham Akbar",
      className: "SD Lower",
      jersey: "77",
      photoUrl: "https://randomuser.me/api/portraits/men/14.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "s20",
      name: "Jason Alexander",
      className: "SD Berkembang",
      jersey: "88",
      photoUrl: "https://randomuser.me/api/portraits/men/15.jpg",
      createdAt: new Date().toISOString(),
    },
  ],
  coaches: [
    {
      id: "c1",
      name: "Coach Andre",
      role: "Head Coach",
      photoUrl: "https://randomuser.me/api/portraits/men/31.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "c2",
      name: "Coach Ryan",
      role: "Assistant",
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "c3",
      name: "Coach Budi",
      role: "Skill Coach",
      photoUrl: "https://randomuser.me/api/portraits/men/33.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "c4",
      name: "Coach Tari",
      role: "Physical Trainer",
      photoUrl: "https://randomuser.me/api/portraits/women/10.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "c5",
      name: "Coach Kevin",
      role: "Assistant",
      photoUrl: "https://randomuser.me/api/portraits/men/35.jpg",
      createdAt: new Date().toISOString(),
    },
  ],
  assessments: [
    {
      id: "a1",
      studentId: "s1",
      date: today(-28),
      scores: { technical: 77, tactical: 71, physical: 79, mental: 80, character: 67 },
      coachId: "c3",
    },
    {
      id: "a2",
      studentId: "s1",
      date: today(-24),
      scores: { technical: 80, tactical: 82, physical: 70, mental: 80, character: 76 },
      coachId: "c4",
    },
    {
      id: "a3",
      studentId: "s1",
      date: today(-21),
      scores: { technical: 83.5, tactical: 76.5, physical: 78.5, mental: 75.5, character: 71.5 },
      coachId: "c1",
    },
    {
      id: "a4",
      studentId: "s1",
      date: today(-17),
      scores: { technical: 80.5, tactical: 79.5, physical: 72.5, mental: 85.5, character: 82.5 },
      coachId: "c1",
    },
    {
      id: "a5",
      studentId: "s1",
      date: today(-14),
      scores: { technical: 72, tactical: 81, physical: 73, mental: 78, character: 84 },
      coachId: "c1",
    },
    {
      id: "a6",
      studentId: "s1",
      date: today(-10),
      scores: { technical: 75, tactical: 81, physical: 83, mental: 74, character: 82 },
      coachId: "c4",
    },
    {
      id: "a7",
      studentId: "s1",
      date: today(-3),
      scores: { technical: 82.5, tactical: 89.5, physical: 81.5, mental: 83.5, character: 81.5 },
      coachId: "c1",
    },
    {
      id: "a8",
      studentId: "s2",
      date: today(-28),
      scores: { technical: 80, tactical: 66, physical: 65, mental: 66, character: 75 },
      coachId: "c4",
    },
    {
      id: "a9",
      studentId: "s2",
      date: today(-24),
      scores: { technical: 69, tactical: 71, physical: 71, mental: 74, character: 75 },
      coachId: "c1",
    },
    {
      id: "a10",
      studentId: "s2",
      date: today(-21),
      scores: { technical: 81.5, tactical: 81.5, physical: 69.5, mental: 80.5, character: 79.5 },
      coachId: "c5",
    },
    {
      id: "a11",
      studentId: "s2",
      date: today(-17),
      scores: { technical: 82.5, tactical: 76.5, physical: 75.5, mental: 75.5, character: 79.5 },
      coachId: "c4",
    },
    {
      id: "a12",
      studentId: "s2",
      date: today(-14),
      scores: { technical: 86, tactical: 87, physical: 77, mental: 75, character: 75 },
      coachId: "c1",
    },
    {
      id: "a13",
      studentId: "s2",
      date: today(-10),
      scores: { technical: 82, tactical: 77, physical: 85, mental: 81, character: 83 },
      coachId: "c1",
    },
    {
      id: "a14",
      studentId: "s2",
      date: today(-7),
      scores: { technical: 88.5, tactical: 85.5, physical: 76.5, mental: 87.5, character: 89.5 },
      coachId: "c2",
    },
    {
      id: "a15",
      studentId: "s3",
      date: today(-28),
      scores: { technical: 76, tactical: 79, physical: 80, mental: 75, character: 80 },
      coachId: "c4",
    },
    {
      id: "a16",
      studentId: "s3",
      date: today(-24),
      scores: { technical: 76, tactical: 78, physical: 75, mental: 77, character: 75 },
      coachId: "c4",
    },
    {
      id: "a17",
      studentId: "s3",
      date: today(-21),
      scores: { technical: 80.5, tactical: 79.5, physical: 72.5, mental: 68.5, character: 76.5 },
      coachId: "c3",
    },
    {
      id: "a18",
      studentId: "s3",
      date: today(-17),
      scores: { technical: 73.5, tactical: 81.5, physical: 75.5, mental: 82.5, character: 76.5 },
      coachId: "c4",
    },
    {
      id: "a19",
      studentId: "s3",
      date: today(-14),
      scores: { technical: 83, tactical: 81, physical: 75, mental: 76, character: 83 },
      coachId: "c5",
    },
    {
      id: "a20",
      studentId: "s3",
      date: today(-10),
      scores: { technical: 86, tactical: 86, physical: 80, mental: 83, character: 82 },
      coachId: "c4",
    },
    {
      id: "a21",
      studentId: "s3",
      date: today(-7),
      scores: { technical: 88.5, tactical: 75.5, physical: 75.5, mental: 87.5, character: 88.5 },
      coachId: "c3",
    },
    {
      id: "a22",
      studentId: "s3",
      date: today(-3),
      scores: { technical: 83.5, tactical: 85.5, physical: 78.5, mental: 91.5, character: 91.5 },
      coachId: "c4",
    },
    {
      id: "a23",
      studentId: "s4",
      date: today(-24),
      scores: { technical: 72, tactical: 76, physical: 74, mental: 82, character: 69 },
      coachId: "c2",
    },
    {
      id: "a24",
      studentId: "s4",
      date: today(-21),
      scores: { technical: 81.5, tactical: 74.5, physical: 74.5, mental: 68.5, character: 78.5 },
      coachId: "c4",
    },
    {
      id: "a25",
      studentId: "s4",
      date: today(-17),
      scores: { technical: 82.5, tactical: 82.5, physical: 79.5, mental: 82.5, character: 82.5 },
      coachId: "c4",
    },
    {
      id: "a26",
      studentId: "s4",
      date: today(-14),
      scores: { technical: 78, tactical: 83, physical: 78, mental: 78, character: 86 },
      coachId: "c4",
    },
    {
      id: "a27",
      studentId: "s4",
      date: today(-10),
      scores: { technical: 76, tactical: 83, physical: 88, mental: 82, character: 85 },
      coachId: "c1",
    },
    {
      id: "a28",
      studentId: "s4",
      date: today(-7),
      scores: { technical: 90.5, tactical: 87.5, physical: 84.5, mental: 80.5, character: 88.5 },
      coachId: "c5",
    },
    {
      id: "a29",
      studentId: "s4",
      date: today(-3),
      scores: { technical: 85.5, tactical: 83.5, physical: 81.5, mental: 85.5, character: 79.5 },
      coachId: "c4",
    },
    {
      id: "a30",
      studentId: "s5",
      date: today(-28),
      scores: { technical: 71, tactical: 78, physical: 73, mental: 73, character: 72 },
      coachId: "c5",
    },
    {
      id: "a31",
      studentId: "s5",
      date: today(-24),
      scores: { technical: 82, tactical: 77, physical: 75, mental: 79, character: 74 },
      coachId: "c4",
    },
    {
      id: "a32",
      studentId: "s5",
      date: today(-17),
      scores: { technical: 81.5, tactical: 85.5, physical: 72.5, mental: 81.5, character: 70.5 },
      coachId: "c4",
    },
    {
      id: "a33",
      studentId: "s5",
      date: today(-14),
      scores: { technical: 83, tactical: 75, physical: 82, mental: 87, character: 75 },
      coachId: "c2",
    },
    {
      id: "a34",
      studentId: "s5",
      date: today(-10),
      scores: { technical: 82, tactical: 74, physical: 84, mental: 85, character: 89 },
      coachId: "c3",
    },
    {
      id: "a35",
      studentId: "s5",
      date: today(-7),
      scores: { technical: 86.5, tactical: 89.5, physical: 83.5, mental: 85.5, character: 83.5 },
      coachId: "c1",
    },
    {
      id: "a36",
      studentId: "s6",
      date: today(-28),
      scores: { technical: 65, tactical: 78, physical: 68, mental: 68, character: 72 },
      coachId: "c1",
    },
    {
      id: "a37",
      studentId: "s6",
      date: today(-24),
      scores: { technical: 75, tactical: 74, physical: 80, mental: 70, character: 81 },
      coachId: "c2",
    },
    {
      id: "a38",
      studentId: "s6",
      date: today(-21),
      scores: { technical: 78.5, tactical: 83.5, physical: 70.5, mental: 75.5, character: 72.5 },
      coachId: "c5",
    },
    {
      id: "a39",
      studentId: "s6",
      date: today(-17),
      scores: { technical: 71.5, tactical: 80.5, physical: 85.5, mental: 79.5, character: 70.5 },
      coachId: "c2",
    },
    {
      id: "a40",
      studentId: "s6",
      date: today(-10),
      scores: { technical: 83, tactical: 81, physical: 79, mental: 86, character: 89 },
      coachId: "c4",
    },
    {
      id: "a41",
      studentId: "s6",
      date: today(-7),
      scores: { technical: 78.5, tactical: 80.5, physical: 87.5, mental: 75.5, character: 88.5 },
      coachId: "c4",
    },
    {
      id: "a42",
      studentId: "s7",
      date: today(-28),
      scores: { technical: 77, tactical: 67, physical: 74, mental: 68, character: 76 },
      coachId: "c3",
    },
    {
      id: "a43",
      studentId: "s7",
      date: today(-24),
      scores: { technical: 78, tactical: 80, physical: 80, mental: 81, character: 79 },
      coachId: "c5",
    },
    {
      id: "a44",
      studentId: "s7",
      date: today(-21),
      scores: { technical: 73.5, tactical: 70.5, physical: 81.5, mental: 76.5, character: 83.5 },
      coachId: "c3",
    },
    {
      id: "a45",
      studentId: "s7",
      date: today(-17),
      scores: { technical: 81.5, tactical: 78.5, physical: 83.5, mental: 81.5, character: 82.5 },
      coachId: "c2",
    },
    {
      id: "a46",
      studentId: "s7",
      date: today(-14),
      scores: { technical: 85, tactical: 74, physical: 78, mental: 72, character: 85 },
      coachId: "c3",
    },
    {
      id: "a47",
      studentId: "s7",
      date: today(-10),
      scores: { technical: 85, tactical: 79, physical: 79, mental: 76, character: 86 },
      coachId: "c4",
    },
    {
      id: "a48",
      studentId: "s7",
      date: today(-7),
      scores: { technical: 75.5, tactical: 88.5, physical: 79.5, mental: 84.5, character: 86.5 },
      coachId: "c1",
    },
    {
      id: "a49",
      studentId: "s7",
      date: today(-3),
      scores: { technical: 90.5, tactical: 88.5, physical: 78.5, mental: 87.5, character: 81.5 },
      coachId: "c3",
    },
    {
      id: "a50",
      studentId: "s8",
      date: today(-24),
      scores: { technical: 67, tactical: 78, physical: 75, mental: 67, character: 74 },
      coachId: "c2",
    },
    {
      id: "a51",
      studentId: "s8",
      date: today(-21),
      scores: { technical: 77.5, tactical: 70.5, physical: 70.5, mental: 74.5, character: 78.5 },
      coachId: "c1",
    },
    {
      id: "a52",
      studentId: "s8",
      date: today(-17),
      scores: { technical: 74.5, tactical: 79.5, physical: 77.5, mental: 79.5, character: 83.5 },
      coachId: "c4",
    },
    {
      id: "a53",
      studentId: "s8",
      date: today(-14),
      scores: { technical: 86, tactical: 75, physical: 73, mental: 73, character: 85 },
      coachId: "c2",
    },
    {
      id: "a54",
      studentId: "s8",
      date: today(-10),
      scores: { technical: 81, tactical: 80, physical: 81, mental: 81, character: 81 },
      coachId: "c5",
    },
    {
      id: "a55",
      studentId: "s8",
      date: today(-7),
      scores: { technical: 84.5, tactical: 81.5, physical: 84.5, mental: 90.5, character: 82.5 },
      coachId: "c5",
    },
    {
      id: "a56",
      studentId: "s9",
      date: today(-24),
      scores: { technical: 67, tactical: 81, physical: 79, mental: 76, character: 80 },
      coachId: "c1",
    },
    {
      id: "a57",
      studentId: "s9",
      date: today(-21),
      scores: { technical: 81.5, tactical: 70.5, physical: 70.5, mental: 79.5, character: 76.5 },
      coachId: "c1",
    },
    {
      id: "a58",
      studentId: "s9",
      date: today(-17),
      scores: { technical: 81.5, tactical: 78.5, physical: 76.5, mental: 78.5, character: 83.5 },
      coachId: "c2",
    },
    {
      id: "a59",
      studentId: "s9",
      date: today(-14),
      scores: { technical: 82, tactical: 87, physical: 81, mental: 79, character: 77 },
      coachId: "c5",
    },
    {
      id: "a60",
      studentId: "s9",
      date: today(-10),
      scores: { technical: 84, tactical: 82, physical: 75, mental: 80, character: 79 },
      coachId: "c3",
    },
    {
      id: "a61",
      studentId: "s9",
      date: today(-7),
      scores: { technical: 79.5, tactical: 81.5, physical: 81.5, mental: 77.5, character: 85.5 },
      coachId: "c4",
    },
    {
      id: "a62",
      studentId: "s9",
      date: today(-3),
      scores: { technical: 90.5, tactical: 89.5, physical: 84.5, mental: 86.5, character: 91.5 },
      coachId: "c3",
    },
    {
      id: "a63",
      studentId: "s10",
      date: today(-28),
      scores: { technical: 72, tactical: 79, physical: 69, mental: 76, character: 78 },
      coachId: "c5",
    },
    {
      id: "a64",
      studentId: "s10",
      date: today(-21),
      scores: { technical: 82.5, tactical: 77.5, physical: 75.5, mental: 80.5, character: 80.5 },
      coachId: "c3",
    },
    {
      id: "a65",
      studentId: "s10",
      date: today(-17),
      scores: { technical: 85.5, tactical: 79.5, physical: 81.5, mental: 83.5, character: 76.5 },
      coachId: "c4",
    },
    {
      id: "a66",
      studentId: "s10",
      date: today(-14),
      scores: { technical: 78, tactical: 72, physical: 85, mental: 85, character: 87 },
      coachId: "c4",
    },
    {
      id: "a67",
      studentId: "s10",
      date: today(-10),
      scores: { technical: 89, tactical: 79, physical: 74, mental: 74, character: 76 },
      coachId: "c5",
    },
    {
      id: "a68",
      studentId: "s10",
      date: today(-7),
      scores: { technical: 81.5, tactical: 82.5, physical: 89.5, mental: 81.5, character: 88.5 },
      coachId: "c5",
    },
    {
      id: "a69",
      studentId: "s11",
      date: today(-28),
      scores: { technical: 76, tactical: 66, physical: 80, mental: 72, character: 80 },
      coachId: "c3",
    },
    {
      id: "a70",
      studentId: "s11",
      date: today(-24),
      scores: { technical: 69, tactical: 71, physical: 78, mental: 80, character: 76 },
      coachId: "c3",
    },
    {
      id: "a71",
      studentId: "s11",
      date: today(-21),
      scores: { technical: 74.5, tactical: 73.5, physical: 69.5, mental: 82.5, character: 75.5 },
      coachId: "c2",
    },
    {
      id: "a72",
      studentId: "s11",
      date: today(-17),
      scores: { technical: 74.5, tactical: 77.5, physical: 83.5, mental: 70.5, character: 79.5 },
      coachId: "c5",
    },
    {
      id: "a73",
      studentId: "s11",
      date: today(-14),
      scores: { technical: 73, tactical: 85, physical: 74, mental: 72, character: 82 },
      coachId: "c3",
    },
    {
      id: "a74",
      studentId: "s11",
      date: today(-7),
      scores: { technical: 89.5, tactical: 82.5, physical: 85.5, mental: 83.5, character: 78.5 },
      coachId: "c1",
    },
    {
      id: "a75",
      studentId: "s11",
      date: today(-3),
      scores: { technical: 78.5, tactical: 87.5, physical: 92.5, mental: 84.5, character: 92.5 },
      coachId: "c5",
    },
    {
      id: "a76",
      studentId: "s12",
      date: today(-28),
      scores: { technical: 73, tactical: 76, physical: 74, mental: 66, character: 67 },
      coachId: "c2",
    },
    {
      id: "a77",
      studentId: "s12",
      date: today(-24),
      scores: { technical: 80, tactical: 77, physical: 75, mental: 72, character: 80 },
      coachId: "c4",
    },
    {
      id: "a78",
      studentId: "s12",
      date: today(-17),
      scores: { technical: 75.5, tactical: 73.5, physical: 78.5, mental: 84.5, character: 79.5 },
      coachId: "c2",
    },
    {
      id: "a79",
      studentId: "s12",
      date: today(-14),
      scores: { technical: 75, tactical: 80, physical: 76, mental: 73, character: 83 },
      coachId: "c1",
    },
    {
      id: "a80",
      studentId: "s12",
      date: today(-10),
      scores: { technical: 82, tactical: 76, physical: 77, mental: 87, character: 74 },
      coachId: "c5",
    },
    {
      id: "a81",
      studentId: "s12",
      date: today(-7),
      scores: { technical: 75.5, tactical: 88.5, physical: 85.5, mental: 76.5, character: 75.5 },
      coachId: "c4",
    },
    {
      id: "a82",
      studentId: "s13",
      date: today(-28),
      scores: { technical: 73, tactical: 80, physical: 73, mental: 65, character: 77 },
      coachId: "c5",
    },
    {
      id: "a83",
      studentId: "s13",
      date: today(-24),
      scores: { technical: 81, tactical: 74, physical: 81, mental: 76, character: 72 },
      coachId: "c2",
    },
    {
      id: "a84",
      studentId: "s13",
      date: today(-21),
      scores: { technical: 82.5, tactical: 83.5, physical: 83.5, mental: 71.5, character: 79.5 },
      coachId: "c5",
    },
    {
      id: "a85",
      studentId: "s13",
      date: today(-17),
      scores: { technical: 82.5, tactical: 70.5, physical: 77.5, mental: 71.5, character: 74.5 },
      coachId: "c3",
    },
    {
      id: "a86",
      studentId: "s13",
      date: today(-14),
      scores: { technical: 82, tactical: 84, physical: 83, mental: 85, character: 73 },
      coachId: "c2",
    },
    {
      id: "a87",
      studentId: "s13",
      date: today(-7),
      scores: { technical: 82.5, tactical: 81.5, physical: 84.5, mental: 80.5, character: 77.5 },
      coachId: "c4",
    },
    {
      id: "a88",
      studentId: "s13",
      date: today(-3),
      scores: { technical: 91.5, tactical: 85.5, physical: 84.5, mental: 78.5, character: 88.5 },
      coachId: "c1",
    },
    {
      id: "a89",
      studentId: "s14",
      date: today(-28),
      scores: { technical: 69, tactical: 78, physical: 68, mental: 74, character: 80 },
      coachId: "c3",
    },
    {
      id: "a90",
      studentId: "s14",
      date: today(-24),
      scores: { technical: 67, tactical: 74, physical: 68, mental: 75, character: 82 },
      coachId: "c1",
    },
    {
      id: "a91",
      studentId: "s14",
      date: today(-21),
      scores: { technical: 72.5, tactical: 76.5, physical: 76.5, mental: 80.5, character: 70.5 },
      coachId: "c4",
    },
    {
      id: "a92",
      studentId: "s14",
      date: today(-17),
      scores: { technical: 83.5, tactical: 72.5, physical: 77.5, mental: 76.5, character: 74.5 },
      coachId: "c4",
    },
    {
      id: "a93",
      studentId: "s14",
      date: today(-14),
      scores: { technical: 73, tactical: 74, physical: 79, mental: 73, character: 82 },
      coachId: "c5",
    },
    {
      id: "a94",
      studentId: "s14",
      date: today(-10),
      scores: { technical: 78, tactical: 88, physical: 80, mental: 88, character: 75 },
      coachId: "c3",
    },
    {
      id: "a95",
      studentId: "s14",
      date: today(-3),
      scores: { technical: 84.5, tactical: 78.5, physical: 84.5, mental: 92.5, character: 89.5 },
      coachId: "c5",
    },
    {
      id: "a96",
      studentId: "s15",
      date: today(-28),
      scores: { technical: 75, tactical: 74, physical: 72, mental: 77, character: 79 },
      coachId: "c2",
    },
    {
      id: "a97",
      studentId: "s15",
      date: today(-24),
      scores: { technical: 71, tactical: 69, physical: 76, mental: 80, character: 67 },
      coachId: "c4",
    },
    {
      id: "a98",
      studentId: "s15",
      date: today(-14),
      scores: { technical: 76, tactical: 73, physical: 73, mental: 72, character: 75 },
      coachId: "c5",
    },
    {
      id: "a99",
      studentId: "s15",
      date: today(-10),
      scores: { technical: 87, tactical: 78, physical: 88, mental: 81, character: 74 },
      coachId: "c5",
    },
    {
      id: "a100",
      studentId: "s15",
      date: today(-7),
      scores: { technical: 79.5, tactical: 75.5, physical: 84.5, mental: 80.5, character: 84.5 },
      coachId: "c1",
    },
    {
      id: "a101",
      studentId: "s15",
      date: today(-3),
      scores: { technical: 86.5, tactical: 78.5, physical: 78.5, mental: 84.5, character: 83.5 },
      coachId: "c3",
    },
    {
      id: "a102",
      studentId: "s16",
      date: today(-28),
      scores: { technical: 78, tactical: 65, physical: 77, mental: 78, character: 70 },
      coachId: "c3",
    },
    {
      id: "a103",
      studentId: "s16",
      date: today(-24),
      scores: { technical: 67, tactical: 68, physical: 70, mental: 74, character: 70 },
      coachId: "c4",
    },
    {
      id: "a104",
      studentId: "s16",
      date: today(-21),
      scores: { technical: 80.5, tactical: 71.5, physical: 80.5, mental: 72.5, character: 75.5 },
      coachId: "c2",
    },
    {
      id: "a105",
      studentId: "s16",
      date: today(-17),
      scores: { technical: 72.5, tactical: 83.5, physical: 74.5, mental: 79.5, character: 82.5 },
      coachId: "c1",
    },
    {
      id: "a106",
      studentId: "s16",
      date: today(-14),
      scores: { technical: 75, tactical: 80, physical: 76, mental: 82, character: 85 },
      coachId: "c4",
    },
    {
      id: "a107",
      studentId: "s16",
      date: today(-10),
      scores: { technical: 80, tactical: 85, physical: 78, mental: 79, character: 77 },
      coachId: "c2",
    },
    {
      id: "a108",
      studentId: "s16",
      date: today(-7),
      scores: { technical: 84.5, tactical: 79.5, physical: 90.5, mental: 82.5, character: 77.5 },
      coachId: "c3",
    },
    {
      id: "a109",
      studentId: "s16",
      date: today(-3),
      scores: { technical: 84.5, tactical: 87.5, physical: 85.5, mental: 85.5, character: 77.5 },
      coachId: "c3",
    },
    {
      id: "a110",
      studentId: "s17",
      date: today(-24),
      scores: { technical: 81, tactical: 79, physical: 73, mental: 80, character: 69 },
      coachId: "c5",
    },
    {
      id: "a111",
      studentId: "s17",
      date: today(-21),
      scores: { technical: 75.5, tactical: 77.5, physical: 79.5, mental: 73.5, character: 81.5 },
      coachId: "c5",
    },
    {
      id: "a112",
      studentId: "s17",
      date: today(-17),
      scores: { technical: 71.5, tactical: 82.5, physical: 75.5, mental: 70.5, character: 73.5 },
      coachId: "c5",
    },
    {
      id: "a113",
      studentId: "s17",
      date: today(-14),
      scores: { technical: 81, tactical: 74, physical: 78, mental: 80, character: 80 },
      coachId: "c5",
    },
    {
      id: "a114",
      studentId: "s17",
      date: today(-7),
      scores: { technical: 83.5, tactical: 84.5, physical: 82.5, mental: 76.5, character: 80.5 },
      coachId: "c2",
    },
    {
      id: "a115",
      studentId: "s17",
      date: today(-3),
      scores: { technical: 91.5, tactical: 83.5, physical: 82.5, mental: 85.5, character: 90.5 },
      coachId: "c5",
    },
    {
      id: "a116",
      studentId: "s18",
      date: today(-28),
      scores: { technical: 74, tactical: 65, physical: 78, mental: 74, character: 68 },
      coachId: "c4",
    },
    {
      id: "a117",
      studentId: "s18",
      date: today(-24),
      scores: { technical: 76, tactical: 80, physical: 68, mental: 72, character: 72 },
      coachId: "c2",
    },
    {
      id: "a118",
      studentId: "s18",
      date: today(-21),
      scores: { technical: 82.5, tactical: 69.5, physical: 83.5, mental: 77.5, character: 68.5 },
      coachId: "c1",
    },
    {
      id: "a119",
      studentId: "s18",
      date: today(-17),
      scores: { technical: 71.5, tactical: 81.5, physical: 74.5, mental: 77.5, character: 83.5 },
      coachId: "c2",
    },
    {
      id: "a120",
      studentId: "s18",
      date: today(-14),
      scores: { technical: 85, tactical: 73, physical: 79, mental: 80, character: 72 },
      coachId: "c5",
    },
    {
      id: "a121",
      studentId: "s18",
      date: today(-10),
      scores: { technical: 76, tactical: 89, physical: 80, mental: 76, character: 78 },
      coachId: "c4",
    },
    {
      id: "a122",
      studentId: "s18",
      date: today(-7),
      scores: { technical: 88.5, tactical: 88.5, physical: 81.5, mental: 75.5, character: 78.5 },
      coachId: "c2",
    },
    {
      id: "a123",
      studentId: "s18",
      date: today(-3),
      scores: { technical: 80.5, tactical: 90.5, physical: 86.5, mental: 89.5, character: 91.5 },
      coachId: "c1",
    },
    {
      id: "a124",
      studentId: "s19",
      date: today(-24),
      scores: { technical: 71, tactical: 70, physical: 80, mental: 71, character: 74 },
      coachId: "c2",
    },
    {
      id: "a125",
      studentId: "s19",
      date: today(-21),
      scores: { technical: 81.5, tactical: 82.5, physical: 68.5, mental: 76.5, character: 68.5 },
      coachId: "c2",
    },
    {
      id: "a126",
      studentId: "s19",
      date: today(-17),
      scores: { technical: 73.5, tactical: 70.5, physical: 83.5, mental: 72.5, character: 73.5 },
      coachId: "c2",
    },
    {
      id: "a127",
      studentId: "s19",
      date: today(-14),
      scores: { technical: 73, tactical: 80, physical: 80, mental: 86, character: 85 },
      coachId: "c3",
    },
    {
      id: "a128",
      studentId: "s19",
      date: today(-7),
      scores: { technical: 77.5, tactical: 84.5, physical: 90.5, mental: 84.5, character: 83.5 },
      coachId: "c4",
    },
    {
      id: "a129",
      studentId: "s19",
      date: today(-3),
      scores: { technical: 85.5, tactical: 80.5, physical: 92.5, mental: 91.5, character: 87.5 },
      coachId: "c2",
    },
    {
      id: "a130",
      studentId: "s20",
      date: today(-28),
      scores: { technical: 69, tactical: 74, physical: 67, mental: 80, character: 77 },
      coachId: "c3",
    },
    {
      id: "a131",
      studentId: "s20",
      date: today(-24),
      scores: { technical: 67, tactical: 77, physical: 77, mental: 80, character: 69 },
      coachId: "c3",
    },
    {
      id: "a132",
      studentId: "s20",
      date: today(-21),
      scores: { technical: 72.5, tactical: 72.5, physical: 79.5, mental: 69.5, character: 70.5 },
      coachId: "c2",
    },
    {
      id: "a133",
      studentId: "s20",
      date: today(-14),
      scores: { technical: 82, tactical: 83, physical: 82, mental: 83, character: 85 },
      coachId: "c5",
    },
    {
      id: "a134",
      studentId: "s20",
      date: today(-10),
      scores: { technical: 89, tactical: 88, physical: 82, mental: 83, character: 80 },
      coachId: "c2",
    },
    {
      id: "a135",
      studentId: "s20",
      date: today(-3),
      scores: { technical: 81.5, tactical: 91.5, physical: 88.5, mental: 90.5, character: 81.5 },
      coachId: "c3",
    },
  ],
  attendance: [
    { id: "at1", studentId: "s1", date: today(-28), status: "Hadir", coachId: "c3" },
    { id: "at2", studentId: "s1", date: today(-24), status: "Hadir", coachId: "c4" },
    { id: "at3", studentId: "s1", date: today(-21), status: "Hadir", coachId: "c1" },
    { id: "at4", studentId: "s1", date: today(-17), status: "Hadir", coachId: "c1" },
    { id: "at5", studentId: "s1", date: today(-14), status: "Hadir", coachId: "c1" },
    { id: "at6", studentId: "s1", date: today(-10), status: "Hadir", coachId: "c4" },
    { id: "at7", studentId: "s1", date: today(-7), status: "Izin", coachId: "c5" },
    { id: "at8", studentId: "s1", date: today(-3), status: "Hadir", coachId: "c1" },
    { id: "at9", studentId: "s2", date: today(-28), status: "Hadir", coachId: "c4" },
    { id: "at10", studentId: "s2", date: today(-24), status: "Hadir", coachId: "c1" },
    { id: "at11", studentId: "s2", date: today(-21), status: "Hadir", coachId: "c5" },
    { id: "at12", studentId: "s2", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at13", studentId: "s2", date: today(-14), status: "Hadir", coachId: "c1" },
    { id: "at14", studentId: "s2", date: today(-10), status: "Hadir", coachId: "c1" },
    { id: "at15", studentId: "s2", date: today(-7), status: "Hadir", coachId: "c2" },
    { id: "at16", studentId: "s2", date: today(-3), status: "Alpha", coachId: "c4" },
    { id: "at17", studentId: "s3", date: today(-28), status: "Hadir", coachId: "c4" },
    { id: "at18", studentId: "s3", date: today(-24), status: "Hadir", coachId: "c4" },
    { id: "at19", studentId: "s3", date: today(-21), status: "Hadir", coachId: "c3" },
    { id: "at20", studentId: "s3", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at21", studentId: "s3", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at22", studentId: "s3", date: today(-10), status: "Hadir", coachId: "c4" },
    { id: "at23", studentId: "s3", date: today(-7), status: "Hadir", coachId: "c3" },
    { id: "at24", studentId: "s3", date: today(-3), status: "Hadir", coachId: "c4" },
    { id: "at25", studentId: "s4", date: today(-28), status: "Izin", coachId: "c1" },
    { id: "at26", studentId: "s4", date: today(-24), status: "Hadir", coachId: "c2" },
    { id: "at27", studentId: "s4", date: today(-21), status: "Hadir", coachId: "c4" },
    { id: "at28", studentId: "s4", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at29", studentId: "s4", date: today(-14), status: "Hadir", coachId: "c4" },
    { id: "at30", studentId: "s4", date: today(-10), status: "Hadir", coachId: "c1" },
    { id: "at31", studentId: "s4", date: today(-7), status: "Hadir", coachId: "c5" },
    { id: "at32", studentId: "s4", date: today(-3), status: "Hadir", coachId: "c4" },
    { id: "at33", studentId: "s5", date: today(-28), status: "Hadir", coachId: "c5" },
    { id: "at34", studentId: "s5", date: today(-24), status: "Hadir", coachId: "c4" },
    { id: "at35", studentId: "s5", date: today(-21), status: "Izin", coachId: "c2" },
    { id: "at36", studentId: "s5", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at37", studentId: "s5", date: today(-14), status: "Hadir", coachId: "c2" },
    { id: "at38", studentId: "s5", date: today(-10), status: "Hadir", coachId: "c3" },
    { id: "at39", studentId: "s5", date: today(-7), status: "Hadir", coachId: "c1" },
    { id: "at40", studentId: "s5", date: today(-3), status: "Sakit", coachId: "c2" },
    { id: "at41", studentId: "s6", date: today(-28), status: "Hadir", coachId: "c1" },
    { id: "at42", studentId: "s6", date: today(-24), status: "Hadir", coachId: "c2" },
    { id: "at43", studentId: "s6", date: today(-21), status: "Hadir", coachId: "c5" },
    { id: "at44", studentId: "s6", date: today(-17), status: "Hadir", coachId: "c2" },
    { id: "at45", studentId: "s6", date: today(-14), status: "Alpha", coachId: "c2" },
    { id: "at46", studentId: "s6", date: today(-10), status: "Hadir", coachId: "c4" },
    { id: "at47", studentId: "s6", date: today(-7), status: "Hadir", coachId: "c4" },
    { id: "at48", studentId: "s6", date: today(-3), status: "Alpha", coachId: "c2" },
    { id: "at49", studentId: "s7", date: today(-28), status: "Hadir", coachId: "c3" },
    { id: "at50", studentId: "s7", date: today(-24), status: "Hadir", coachId: "c5" },
    { id: "at51", studentId: "s7", date: today(-21), status: "Hadir", coachId: "c3" },
    { id: "at52", studentId: "s7", date: today(-17), status: "Hadir", coachId: "c2" },
    { id: "at53", studentId: "s7", date: today(-14), status: "Hadir", coachId: "c3" },
    { id: "at54", studentId: "s7", date: today(-10), status: "Hadir", coachId: "c4" },
    { id: "at55", studentId: "s7", date: today(-7), status: "Hadir", coachId: "c1" },
    { id: "at56", studentId: "s7", date: today(-3), status: "Hadir", coachId: "c3" },
    { id: "at57", studentId: "s8", date: today(-28), status: "Alpha", coachId: "c2" },
    { id: "at58", studentId: "s8", date: today(-24), status: "Hadir", coachId: "c2" },
    { id: "at59", studentId: "s8", date: today(-21), status: "Hadir", coachId: "c1" },
    { id: "at60", studentId: "s8", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at61", studentId: "s8", date: today(-14), status: "Hadir", coachId: "c2" },
    { id: "at62", studentId: "s8", date: today(-10), status: "Hadir", coachId: "c5" },
    { id: "at63", studentId: "s8", date: today(-7), status: "Hadir", coachId: "c5" },
    { id: "at64", studentId: "s8", date: today(-3), status: "Izin", coachId: "c1" },
    { id: "at65", studentId: "s9", date: today(-28), status: "Izin", coachId: "c1" },
    { id: "at66", studentId: "s9", date: today(-24), status: "Hadir", coachId: "c1" },
    { id: "at67", studentId: "s9", date: today(-21), status: "Hadir", coachId: "c1" },
    { id: "at68", studentId: "s9", date: today(-17), status: "Hadir", coachId: "c2" },
    { id: "at69", studentId: "s9", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at70", studentId: "s9", date: today(-10), status: "Hadir", coachId: "c3" },
    { id: "at71", studentId: "s9", date: today(-7), status: "Hadir", coachId: "c4" },
    { id: "at72", studentId: "s9", date: today(-3), status: "Hadir", coachId: "c3" },
    { id: "at73", studentId: "s10", date: today(-28), status: "Hadir", coachId: "c5" },
    { id: "at74", studentId: "s10", date: today(-24), status: "Izin", coachId: "c5" },
    { id: "at75", studentId: "s10", date: today(-21), status: "Hadir", coachId: "c3" },
    { id: "at76", studentId: "s10", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at77", studentId: "s10", date: today(-14), status: "Hadir", coachId: "c4" },
    { id: "at78", studentId: "s10", date: today(-10), status: "Hadir", coachId: "c5" },
    { id: "at79", studentId: "s10", date: today(-7), status: "Hadir", coachId: "c5" },
    { id: "at80", studentId: "s10", date: today(-3), status: "Izin", coachId: "c5" },
    { id: "at81", studentId: "s11", date: today(-28), status: "Hadir", coachId: "c3" },
    { id: "at82", studentId: "s11", date: today(-24), status: "Hadir", coachId: "c3" },
    { id: "at83", studentId: "s11", date: today(-21), status: "Hadir", coachId: "c2" },
    { id: "at84", studentId: "s11", date: today(-17), status: "Hadir", coachId: "c5" },
    { id: "at85", studentId: "s11", date: today(-14), status: "Hadir", coachId: "c3" },
    { id: "at86", studentId: "s11", date: today(-10), status: "Izin", coachId: "c3" },
    { id: "at87", studentId: "s11", date: today(-7), status: "Hadir", coachId: "c1" },
    { id: "at88", studentId: "s11", date: today(-3), status: "Hadir", coachId: "c5" },
    { id: "at89", studentId: "s12", date: today(-28), status: "Hadir", coachId: "c2" },
    { id: "at90", studentId: "s12", date: today(-24), status: "Hadir", coachId: "c4" },
    { id: "at91", studentId: "s12", date: today(-21), status: "Sakit", coachId: "c5" },
    { id: "at92", studentId: "s12", date: today(-17), status: "Hadir", coachId: "c2" },
    { id: "at93", studentId: "s12", date: today(-14), status: "Hadir", coachId: "c1" },
    { id: "at94", studentId: "s12", date: today(-10), status: "Hadir", coachId: "c5" },
    { id: "at95", studentId: "s12", date: today(-7), status: "Hadir", coachId: "c4" },
    { id: "at96", studentId: "s12", date: today(-3), status: "Sakit", coachId: "c2" },
    { id: "at97", studentId: "s13", date: today(-28), status: "Hadir", coachId: "c5" },
    { id: "at98", studentId: "s13", date: today(-24), status: "Hadir", coachId: "c2" },
    { id: "at99", studentId: "s13", date: today(-21), status: "Hadir", coachId: "c5" },
    { id: "at100", studentId: "s13", date: today(-17), status: "Hadir", coachId: "c3" },
    { id: "at101", studentId: "s13", date: today(-14), status: "Hadir", coachId: "c2" },
    { id: "at102", studentId: "s13", date: today(-10), status: "Alpha", coachId: "c2" },
    { id: "at103", studentId: "s13", date: today(-7), status: "Hadir", coachId: "c4" },
    { id: "at104", studentId: "s13", date: today(-3), status: "Hadir", coachId: "c1" },
    { id: "at105", studentId: "s14", date: today(-28), status: "Hadir", coachId: "c3" },
    { id: "at106", studentId: "s14", date: today(-24), status: "Hadir", coachId: "c1" },
    { id: "at107", studentId: "s14", date: today(-21), status: "Hadir", coachId: "c4" },
    { id: "at108", studentId: "s14", date: today(-17), status: "Hadir", coachId: "c4" },
    { id: "at109", studentId: "s14", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at110", studentId: "s14", date: today(-10), status: "Hadir", coachId: "c3" },
    { id: "at111", studentId: "s14", date: today(-7), status: "Izin", coachId: "c1" },
    { id: "at112", studentId: "s14", date: today(-3), status: "Hadir", coachId: "c5" },
    { id: "at113", studentId: "s15", date: today(-28), status: "Hadir", coachId: "c2" },
    { id: "at114", studentId: "s15", date: today(-24), status: "Hadir", coachId: "c4" },
    { id: "at115", studentId: "s15", date: today(-21), status: "Sakit", coachId: "c1" },
    { id: "at116", studentId: "s15", date: today(-17), status: "Alpha", coachId: "c2" },
    { id: "at117", studentId: "s15", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at118", studentId: "s15", date: today(-10), status: "Hadir", coachId: "c5" },
    { id: "at119", studentId: "s15", date: today(-7), status: "Hadir", coachId: "c1" },
    { id: "at120", studentId: "s15", date: today(-3), status: "Hadir", coachId: "c3" },
    { id: "at121", studentId: "s16", date: today(-28), status: "Hadir", coachId: "c3" },
    { id: "at122", studentId: "s16", date: today(-24), status: "Hadir", coachId: "c4" },
    { id: "at123", studentId: "s16", date: today(-21), status: "Hadir", coachId: "c2" },
    { id: "at124", studentId: "s16", date: today(-17), status: "Hadir", coachId: "c1" },
    { id: "at125", studentId: "s16", date: today(-14), status: "Hadir", coachId: "c4" },
    { id: "at126", studentId: "s16", date: today(-10), status: "Hadir", coachId: "c2" },
    { id: "at127", studentId: "s16", date: today(-7), status: "Hadir", coachId: "c3" },
    { id: "at128", studentId: "s16", date: today(-3), status: "Hadir", coachId: "c3" },
    { id: "at129", studentId: "s17", date: today(-28), status: "Izin", coachId: "c4" },
    { id: "at130", studentId: "s17", date: today(-24), status: "Hadir", coachId: "c5" },
    { id: "at131", studentId: "s17", date: today(-21), status: "Hadir", coachId: "c5" },
    { id: "at132", studentId: "s17", date: today(-17), status: "Hadir", coachId: "c5" },
    { id: "at133", studentId: "s17", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at134", studentId: "s17", date: today(-10), status: "Izin", coachId: "c2" },
    { id: "at135", studentId: "s17", date: today(-7), status: "Hadir", coachId: "c2" },
    { id: "at136", studentId: "s17", date: today(-3), status: "Hadir", coachId: "c5" },
    { id: "at137", studentId: "s18", date: today(-28), status: "Hadir", coachId: "c4" },
    { id: "at138", studentId: "s18", date: today(-24), status: "Hadir", coachId: "c2" },
    { id: "at139", studentId: "s18", date: today(-21), status: "Hadir", coachId: "c1" },
    { id: "at140", studentId: "s18", date: today(-17), status: "Hadir", coachId: "c2" },
    { id: "at141", studentId: "s18", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at142", studentId: "s18", date: today(-10), status: "Hadir", coachId: "c4" },
    { id: "at143", studentId: "s18", date: today(-7), status: "Hadir", coachId: "c2" },
    { id: "at144", studentId: "s18", date: today(-3), status: "Hadir", coachId: "c1" },
    { id: "at145", studentId: "s19", date: today(-28), status: "Izin", coachId: "c3" },
    { id: "at146", studentId: "s19", date: today(-24), status: "Hadir", coachId: "c2" },
    { id: "at147", studentId: "s19", date: today(-21), status: "Hadir", coachId: "c2" },
    { id: "at148", studentId: "s19", date: today(-17), status: "Hadir", coachId: "c2" },
    { id: "at149", studentId: "s19", date: today(-14), status: "Hadir", coachId: "c3" },
    { id: "at150", studentId: "s19", date: today(-10), status: "Izin", coachId: "c1" },
    { id: "at151", studentId: "s19", date: today(-7), status: "Hadir", coachId: "c4" },
    { id: "at152", studentId: "s19", date: today(-3), status: "Hadir", coachId: "c2" },
    { id: "at153", studentId: "s20", date: today(-28), status: "Hadir", coachId: "c3" },
    { id: "at154", studentId: "s20", date: today(-24), status: "Hadir", coachId: "c3" },
    { id: "at155", studentId: "s20", date: today(-21), status: "Hadir", coachId: "c2" },
    { id: "at156", studentId: "s20", date: today(-17), status: "Sakit", coachId: "c3" },
    { id: "at157", studentId: "s20", date: today(-14), status: "Hadir", coachId: "c5" },
    { id: "at158", studentId: "s20", date: today(-10), status: "Hadir", coachId: "c2" },
    { id: "at159", studentId: "s20", date: today(-7), status: "Sakit", coachId: "c4" },
    { id: "at160", studentId: "s20", date: today(-3), status: "Hadir", coachId: "c3" },
  ],
};

let state: AcademyState = initial;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = { ...initial, ...JSON.parse(raw) };
    } else {
      // Migrate from v2 to preserve logo
      const raw2 = localStorage.getItem("hoop-academy-v2");
      if (raw2) {
        const oldState = JSON.parse(raw2);
        state = { ...initial, logoUrl: oldState.logoUrl, theme: oldState.theme };
      }
    }
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
export function addCoach(c: Omit<Coach, "id" | "createdAt">) {
  state = {
    ...state,
    coaches: [
      ...state.coaches,
      { ...c, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ],
  };
  persist();
}
export function updateCoach(id: string, c: Partial<Omit<Coach, "id" | "createdAt">>) {
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
