import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PILLARS } from "@/lib/academy-types";
import {
  Award,
  Calculator,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
  Users,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SCALE = [
  { n: 1, label: "Perlu banyak bimbingan" },
  { n: 2, label: "Mulai berkembang" },
  { n: 3, label: "Cukup / sesuai target" },
  { n: 4, label: "Baik" },
  { n: 5, label: "Sangat baik" },
];

const ATT_WEIGHTS = [
  { s: "Hadir", w: 100 },
  { s: "Izin", w: 80 },
  { s: "Sakit", w: 80 },
  { s: "Alpha", w: 0 },
];

const GRADES = [
  { r: "90–100", p: "Excellent", tone: "bg-success text-success-foreground" },
  { r: "80–89", p: "Good", tone: "bg-primary text-primary-foreground" },
  { r: "70–79", p: "Fair", tone: "bg-warning text-warning-foreground" },
  { r: "60–69", p: "Needs Work", tone: "bg-warning/60 text-warning-foreground" },
  { r: "<60", p: "Poor", tone: "bg-destructive text-destructive-foreground" },
];

const LEVELS: Level[] = [
  {
    key: "sd-lower",
    name: "SD Lower",
    age: "<6–8 Tahun",
    focus: "Fundamental & Fun",
    headline: "Mengenal bola, gerak tubuh, koordinasi, dan kecintaan terhadap basket.",
    materials: [
      "Mengenal bola basket",
      "Koordinasi mata dan tangan",
      "Keseimbangan tubuh",
      "Berlari, berhenti, melompat, berputar",
      "Mengenal konsep ruang dan arah",
      "Sportivitas dan kerja sama",
    ],
    techniques: {
      "Ball Handling": [
        "Memegang dan mengontrol bola",
        "Ball familiarization",
        "Pound dribble sederhana",
        "Dribble kanan dan kiri",
        "Dribble sambil berjalan",
      ],
      Passing: ["Chest pass", "Bounce pass", "Overhead pass", "Passing berpasangan"],
      Shooting: [
        "BEEF dasar: Balance, Eyes, Elbow, Follow through",
        "Shooting jarak sangat dekat",
        "One-hand shooting dasar",
      ],
      Footwork: ["Jump stop", "Stride stop", "Pivot dasar", "Melompat dan mendarat dengan aman"],
    },
    composition: [
      { label: "Permainan & fun games", value: 70 },
      { label: "Pengenalan teknik", value: 20 },
      { label: "Pertandingan sederhana", value: 10 },
    ],
    targets: [
      "Mengontrol bola dengan percaya diri",
      "Dribble menggunakan kedua tangan",
      "Melakukan passing sederhana",
      "Melakukan shooting dengan teknik dasar",
      "Memahami aturan sederhana permainan",
    ],
  },
  {
    key: "sd-berkembang",
    name: "SD Berkembang",
    age: "8–10 Tahun",
    focus: "Basic Skill Development",
    headline: "Membangun fundamental teknik secara konsisten.",
    materials: [
      "Ball handling",
      "Passing dan receiving",
      "Shooting dasar",
      "Lay-up",
      "Defense dasar",
      "1-on-1",
      "Pengambilan keputusan sederhana",
    ],
    techniques: {
      "Ball Handling": [
        "Right-hand dribble",
        "Left-hand dribble",
        "Crossover",
        "Between the legs dasar",
        "Behind the back pengenalan",
        "Change of speed",
        "Change of direction",
      ],
      Passing: [
        "Chest pass",
        "Bounce pass",
        "Overhead pass",
        "Passing sambil bergerak",
        "Passing dengan tekanan defense",
      ],
      Shooting: [
        "Form shooting",
        "Set shot",
        "Lay-up kanan",
        "Lay-up kiri",
        "Shooting setelah dribble",
      ],
      Finishing: ["Right-hand lay-up", "Left-hand lay-up", "Power lay-up", "Jump stop finishing"],
      Defense: [
        "Defensive stance",
        "Defensive slide",
        "Close out",
        "Menjaga pemain dengan bola",
        "Menjaga pemain tanpa bola",
      ],
      Taktik: ["1-on-1", "2-on-2", "3-on-3", "Give and go", "Spacing sederhana", "Cut menuju ring"],
    },
    composition: [
      { label: "Teknik fundamental", value: 40 },
      { label: "Game situation", value: 30 },
      { label: "Koordinasi & agility", value: 20 },
      { label: "Pertandingan", value: 10 },
    ],
    targets: [
      "Dribble dengan kedua tangan",
      "Melakukan lay-up kanan dan kiri",
      "Bermain 1-on-1",
      "Memahami spacing",
      "Melakukan defense dasar",
      "Membuat keputusan sederhana saat bermain",
    ],
  },
  {
    key: "sd-upper",
    name: "SD Upper",
    age: "10–12 Tahun",
    focus: "Skill Application",
    headline:
      'Mengaplikasikan teknik dalam situasi pertandingan. Pada level ini anak mulai diarahkan dari "bisa melakukan teknik" menjadi "tahu kapan harus menggunakan teknik."',
    materials: [],
    techniques: {
      "Ball Handling": [
        "Crossover",
        "Between the legs",
        "Behind the back",
        "Hesitation",
        "Change of pace",
        "Retreat dribble",
        "Protect the ball",
      ],
      Passing: [
        "Passing dengan defense",
        "Passing dari dribble",
        "Skip pass",
        "Extra pass",
        "Passing ke ruang kosong",
      ],
      Shooting: [
        "Catch and shoot",
        "Pull-up shooting",
        "Shooting setelah crossover",
        "Shooting dari berbagai spot",
        "Free throw routine",
      ],
      Finishing: [
        "Lay-up dengan tekanan defense",
        "Euro step dasar",
        "Reverse lay-up",
        "Floater dasar",
        "Finishing menggunakan tangan lemah",
      ],
      Defense: [
        "On-ball defense",
        "Help defense",
        "Close out",
        "Deny defense",
        "Defensive transition",
        "Rebound positioning",
      ],
      Taktik: [
        "2-on-2",
        "3-on-3",
        "4-on-4",
        "5-on-5 dasar",
        "Give and go",
        "Pick and roll pengenalan",
        "Fast break",
        "Transition defense",
        "Help and recover",
      ],
    },
    composition: [
      { label: "Individual skill", value: 40 },
      { label: "Game situation", value: 30 },
      { label: "Tactical understanding", value: 20 },
      { label: "Physical development", value: 10 },
    ],
    targets: [
      "Menggunakan teknik dalam permainan",
      "Bermain dengan kedua tangan",
      "Membaca situasi 1-on-1",
      "Memahami konsep spacing",
      "Melakukan fast break",
      "Mengerti dasar team defense",
    ],
  },
  {
    key: "smp",
    name: "SMP",
    age: "12–15 Tahun",
    focus: "Performance & Tactical Development",
    headline:
      "Peningkatan kualitas teknik, pemahaman taktik, dan perkembangan fisik. Tahap penting menuju competitive basketball.",
    materials: [],
    techniques: {
      "Ball Handling": [
        "Advanced crossover",
        "In and out",
        "Between the legs",
        "Behind the back",
        "Spin move",
        "Change of speed",
        "Change of direction",
        "Ball protection under pressure",
      ],
      Shooting: [
        "Catch and shoot",
        "Pull-up jumper",
        "Side step",
        "Step back dasar",
        "Shooting off the dribble",
        "Shooting dari berbagai area",
        "Free throw consistency",
      ],
      Finishing: [
        "Contact finishing",
        "Euro step",
        "Pro hop",
        "Reverse lay-up",
        "Floater",
        "Finishing dengan tangan lemah",
      ],
      Passing: [
        "Passing dalam tekanan",
        "Pocket pass",
        "Skip pass",
        "Drive and kick",
        "Passing membaca rotasi defense",
      ],
      Defense: [
        "On-ball defense",
        "Help defense",
        "Pick and roll defense",
        "Close out",
        "Rotation",
        "Defensive communication",
        "Rebounding technique",
      ],
      "Taktik Tim": [
        "5-out offense",
        "4-out 1-in",
        "Motion offense",
        "Pick and roll",
        "Pick and pop",
        "Fast break",
        "Secondary break",
        "Press break",
        "Zone offense",
        "Man-to-man defense",
        "Zone defense",
      ],
      "Physical Development": [
        "Speed",
        "Agility",
        "Coordination",
        "Jumping ability",
        "Core stability",
        "Strength dasar dengan bodyweight",
        "Mobility",
        "Injury prevention",
      ],
    },
    note: "Pada usia ini latihan fisik harus menyesuaikan perkembangan biologis, bukan hanya usia kalender.",
    composition: [
      { label: "Individual skill", value: 35 },
      { label: "Tactical training", value: 30 },
      { label: "Game situation", value: 20 },
      { label: "Physical development", value: 15 },
    ],
    targets: [
      "Bermain dalam sistem tim",
      "Memahami posisi dan peran",
      "Mengambil keputusan cepat",
      "Bermain dalam tekanan",
      "Memiliki satu atau dua keunggulan skill",
      "Menjalankan sistem offense dan defense",
    ],
  },
  {
    key: "sma",
    name: "SMA",
    age: "15–18 Tahun",
    focus: "Competitive & High Performance",
    headline:
      "Performa kompetitif, spesialisasi posisi, dan persiapan level prestasi: kompetisi daerah, nasional, klub, universitas, profesional.",
    materials: [],
    techniques: {
      Guard: [
        "Advanced ball handling",
        "Pick and roll reading",
        "Pull-up shooting",
        "Change of pace",
        "Creating separation",
        "Playmaking",
        "Decision making",
      ],
      Wing: [
        "Catch and shoot",
        "Attack close out",
        "Mid-range game",
        "Post-up",
        "Cutting",
        "Transition finishing",
      ],
      "Forward / Big": [
        "Post moves",
        "Face-up attack",
        "Pick and roll",
        "Pick and pop",
        "Rebounding",
        "Rim protection",
        "Finishing through contact",
      ],
      "Shooting Development": [
        "Shooting volume",
        "Shooting consistency",
        "Game-speed shooting",
        "Movement shooting",
        "Off-screen shooting",
        "Pick and roll shooting",
        "Free throw routine",
      ],
      "Advanced Defense": [
        "Individual defense",
        "Team defense",
        "Pick and roll defense",
        "Switching",
        "Hedge",
        "Drop coverage",
        "Zone defense",
        "Full court press",
        "Defensive rotation",
      ],
      Taktik: [
        "Offensive system",
        "Defensive system",
        "Special situation",
        "End game situation",
        "Last shot",
        "Press break",
        "ATO — After Time Out",
        "Scouting lawan",
        "Game preparation",
      ],
      "Physical Performance": [
        "Strength",
        "Power",
        "Speed",
        "Agility",
        "Conditioning",
        "Recovery",
        "Mobility",
        "Injury prevention",
      ],
      "Mental & Performance": [
        "Leadership",
        "Discipline",
        "Communication",
        "Mental toughness",
        "Game preparation",
        "Goal setting",
        "Team responsibility",
        "Sportsmanship",
      ],
    },
    composition: [
      { label: "Individual skill", value: 30 },
      { label: "Tactical training", value: 30 },
      { label: "Game situation", value: 20 },
      { label: "Physical performance", value: 15 },
      { label: "Mental/performance", value: 5 },
    ],
    targets: [
      "Bertanding di level daerah/nasional",
      "Memahami spesialisasi posisi",
      "Menjalankan sistem kompleks",
      "Bermain di bawah tekanan",
      "Memiliki pola latihan recovery",
      "Siap masuk klub/universitas",
    ],
  },
];

const SUMMARY = [
  { level: "SD Lower", age: "<6–8", focus: "Fun & Movement", target: "Suka bermain basket" },
  {
    level: "SD Berkembang",
    age: "8–10",
    focus: "Basic Fundamental",
    target: "Menguasai teknik dasar",
  },
  {
    level: "SD Upper",
    age: "10–12",
    focus: "Skill Application",
    target: "Menggunakan teknik dalam game",
  },
  { level: "SMP", age: "12–15", focus: "Performance & Tactics", target: "Bermain dalam sistem" },
  { level: "SMA", age: "15–18", focus: "High Performance", target: "Siap berkompetisi" },
];

const CONCEPTS = [
  {
    title: "Technical Skill",
    items: ["Dribbling", "Passing", "Shooting", "Finishing", "Footwork"],
  },
  {
    title: "Tactical Understanding",
    items: ["1-on-1", "2-on-2", "3-on-3", "5-on-5", "Offense", "Defense"],
  },
  {
    title: "Physical Development",
    items: ["Speed", "Agility", "Strength", "Power", "Endurance", "Mobility"],
  },
  {
    title: "Mental Development",
    items: ["Discipline", "Confidence", "Focus", "Leadership", "Resilience"],
  },
  {
    title: "Character & Teamwork",
    items: ["Respect", "Responsibility", "Communication", "Teamwork", "Sportsmanship"],
  },
];

interface Level {
  key: string;
  name: string;
  age: string;
  focus: string;
  headline: string;
  materials: string[];
  techniques: Record<string, string[]>;
  composition: { label: string; value: number }[];
  targets: string[];
  note?: string;
}

export function CurriculumView({ onBack }: { onBack?: () => void }) {
  return (
    <div className="space-y-5 pb-4">
      {onBack && (
        <div className="mb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* Pathway Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-court-gradient p-6 text-primary-foreground shadow-lg">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur border border-transparent dark:border-white">
            <GraduationCap className="h-3 w-3" /> Development Pathway
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight dark:text-orange-500">
            🏀 Kurikulum Dragons Basketball Academy
          </h1>
          <p className="mt-2 text-sm opacity-90 dark:text-white">
            Kurikulum berjenjang dari usia dini hingga prestasi, memadukan teknik, taktik, fisik,
            dan karakter.
          </p>
        </div>
      </section>

      {/* Levels */}
      {LEVELS.map((level) => (
        <LevelCard key={level.key} level={level} />
      ))}

      {/* Summary */}
      <section>
        <SectionTitle icon={Target} title="Ringkasan Perkembangan" subtitle="Perjalanan level" />
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-12 bg-muted px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="col-span-3">Level</span>
            <span className="col-span-2">Usia</span>
            <span className="col-span-4">Fokus</span>
            <span className="col-span-3">Target</span>
          </div>
          <div className="divide-y divide-border">
            {SUMMARY.map((s) => (
              <div key={s.level} className="grid grid-cols-12 px-3 py-2.5 text-xs">
                <span className="col-span-3 font-black">{s.level}</span>
                <span className="col-span-2 text-muted-foreground">{s.age}</span>
                <span className="col-span-4 font-medium">{s.focus}</span>
                <span className="col-span-3 text-muted-foreground">{s.target}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Pillars Concept */}
      <section>
        <SectionTitle
          icon={Users}
          title="Konsep Utama Akademi"
          subtitle="5 Pilar Basketball Academy"
        />
        <div className="space-y-2">
          {CONCEPTS.map((c, i) => (
            <Card key={c.title} className="p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-xs font-black text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="text-sm font-black">{c.title}</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-secondary-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-2 bg-accent p-4 text-accent-foreground">
          <p className="text-xs leading-relaxed">
            <b>Prinsip penting:</b> untuk anak usia dini jangan terlalu cepat memaksa spesialisasi
            posisi. Bangun dulu athletic ability + fundamental skill. Spesialisasi posisi mulai
            lebih jelas pada usia SMP–SMA, sesuai kemampuan dan karakter pemain.
          </p>
        </Card>
      </section>

      {/* Hero Scoring */}
      <section className="relative overflow-hidden rounded-3xl bg-hero-gradient p-6 text-primary-foreground shadow-lg">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
            <Sparkles className="h-3 w-3" /> Penilaian
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight">Struktur Nilai Rapor 🏀</h1>
          <p className="mt-2 text-sm opacity-90">
            Sistem penilaian 5 pilar performa berbasis level usia, dengan rumus terbobot yang adil
            dari sesi harian hingga rapor akhir.
          </p>
        </div>
      </section>

      {/* 5 Pilars */}
      <section>
        <SectionTitle icon={Target} title="5 Pilar Penilaian" subtitle="Total = 100%" />
        <div className="grid grid-cols-2 gap-2">
          {PILLARS.map((p, i) => (
            <Card key={p.key} className="relative overflow-hidden p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pilar {i + 1}
              </p>
              <p className="mt-1 text-sm font-black leading-tight">{p.label}</p>
              <p className="mt-2 text-2xl font-black text-primary">
                {(p.weight * 100).toFixed(0)}%
              </p>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center bg-secondary p-3 text-secondary-foreground">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total</p>
            <p className="mt-1 text-3xl font-black text-primary">100%</p>
          </Card>
        </div>
      </section>

      {/* Daily Score */}
      <section>
        <SectionTitle
          icon={ClipboardList}
          title="1. Nilai Harian"
          subtitle="Skala 1–5 tiap indikator"
        />
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">
            Setiap latihan, coach menilai berdasarkan indikator sesuai level usia.
          </p>
          <div className="mt-3 space-y-1.5">
            {SCALE.map((s) => (
              <div key={s.n} className="flex items-center gap-2 rounded-lg bg-muted/50 px-2 py-1.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary text-xs font-black text-primary-foreground">
                  {s.n}
                </span>
                <span className="text-xs">{s.label}</span>
              </div>
            ))}
          </div>
          <Formula
            title="Rumus Nilai Harian Pilar"
            body="(Total Nilai Indikator ÷ Total Nilai Maksimal) × 100"
          />
          <Example>
            Technical Skill — Ball Handling 4, Passing 3, Shooting 4, Finishing 3, Footwork 4
            <br />
            <b>18 ÷ 25 × 100 = 72</b>
          </Example>
        </Card>
      </section>

      {/* Period */}
      <section>
        <SectionTitle icon={Calculator} title="2. Nilai Periode" subtitle="Rata-rata sesi" />
        <Card className="p-4">
          <Formula title="Rumus Nilai Pilar Periode" body="Σ Nilai Harian ÷ Jumlah Sesi Diikuti" />
          <Example>
            Technical: 72, 75, 78, 80 → (72+75+78+80) ÷ 4 = <b>76,25</b>
          </Example>
        </Card>
      </section>

      {/* Attendance */}
      <section>
        <SectionTitle icon={Award} title="3. Absensi" subtitle="Disiplin kehadiran" />
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {ATT_WEIGHTS.map((a) => (
              <div key={a.s} className="rounded-xl bg-muted p-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {a.s}
                </p>
                <p className="mt-1 text-lg font-black text-primary">{a.w}%</p>
              </div>
            ))}
          </div>
          <Formula
            title="Rumus Nilai Absensi"
            body="(Total Poin Kehadiran ÷ Total Pertemuan) × 100"
          />
          <Example>
            8 sesi: Hadir 7 × 100 + Izin 1 × 80 = 780 → 780 ÷ 8 = <b>97,5 → 98</b>
          </Example>
        </Card>
      </section>

      {/* Final Formula */}
      <section>
        <SectionTitle
          icon={Trophy}
          title="4. Nilai Akhir Rapor"
          subtitle="Pilar 90% + Kehadiran 10%"
        />
        <Card className="overflow-hidden">
          <div className="bg-court-gradient p-5 text-primary-foreground">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
              Rumus Final
            </p>
            <p className="mt-2 text-xl font-black leading-snug">
              (Nilai 5 Pilar × 90%) + (Nilai Kehadiran × 10%)
            </p>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-xs font-bold">Contoh</p>
            <ul className="divide-y divide-border rounded-xl border border-border text-xs">
              {[
                ["Technical Skill", 80, 30, 24.0],
                ["Tactical Understanding", 75, 20, 15.0],
                ["Physical Development", 78, 20, 15.6],
                ["Mental Development", 85, 15, 12.75],
                ["Character & Teamwork", 90, 15, 13.5],
              ].map(([n, v, w, r]) => (
                <li key={n as string} className="flex items-center justify-between px-3 py-1.5">
                  <span className="font-medium">{n}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {v} × {w}% = <b className="text-foreground">{r}</b>
                  </span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-secondary p-3 text-secondary-foreground">
              <p className="text-[10px] uppercase tracking-widest opacity-80">Total 5 Pilar</p>
              <p className="text-2xl font-black text-primary">80,85</p>
              <p className="mt-2 text-[11px] opacity-80">
                (80,85 × 90%) + (90 × 10%) = 72,77 + 9 = <b className="text-primary">81,77</b>
              </p>
              <p className="mt-2 text-3xl font-black text-primary">🏆 82</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Grades */}
      <section>
        <SectionTitle icon={Sparkles} title="Kategori Nilai" />
        <div className="space-y-1.5">
          {GRADES.map((g) => (
            <div
              key={g.r}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2"
            >
              <span className="text-xs font-bold tabular-nums">{g.r}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${g.tone}`}
              >
                {g.p}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Card className="bg-accent p-4 text-accent-foreground">
        <p className="text-xs leading-relaxed">
          <b>Catatan penting:</b> Indikator penilaian berbeda per level usia — anak usia 6 tahun
          tidak dibandingkan langsung dengan atlet usia 16 tahun. Rumus tetap sama, tetapi standar
          indikator disesuaikan.
        </p>
      </Card>
    </div>
  );
}

function LevelCard({ level }: { level: Level }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-secondary/40 p-4 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-black text-primary-foreground uppercase">
              {level.age}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {level.focus}
            </span>
          </div>
          <h3 className="mt-1 text-base font-black">{level.name}</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div className={`space-y-4 p-4 text-xs ${open ? "block" : "hidden"}`}>
        <p className="leading-relaxed text-muted-foreground">{level.headline}</p>

        {level.materials.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Materi Utama
            </p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-muted-foreground">
              {level.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Teknik Basket
          </p>
          <div className="mt-1.5 space-y-2">
            {Object.entries(level.techniques).map(([category, items]) => (
              <div key={category} className="rounded-xl bg-muted/50 p-2.5">
                <p className="font-bold text-foreground">{category}</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted-foreground">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Komposisi Latihan
          </p>
          <div className="mt-1.5 space-y-1.5">
            {level.composition.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span className="w-8 font-black tabular-nums text-primary">{c.value}%</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
                <span className="w-24 truncate text-right text-[10px] text-muted-foreground">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Target Kelulusan Level
          </p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-muted-foreground">
            {level.targets.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        {level.note && (
          <div className="rounded-xl bg-accent/50 p-3 text-accent-foreground">
            <p className="text-[10px] font-bold uppercase tracking-wider">Catatan</p>
            <p className="mt-1 leading-relaxed">{level.note}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-black">{title}</h2>
      </div>
      {subtitle && <span className="text-[11px] text-muted-foreground">{subtitle}</span>}
    </div>
  );
}

function Formula({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{title}</p>
      <p className="mt-1 text-sm font-bold text-foreground">{body}</p>
    </div>
  );
}

function Example({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-xl bg-muted p-3 text-[11px] leading-relaxed text-muted-foreground">
      <span className="mr-1 font-bold text-foreground">Contoh:</span>
      {children}
    </div>
  );
}
