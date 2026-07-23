import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav, type Tab } from "@/components/academy/BottomNav";
import { DashboardView } from "@/components/academy/DashboardView";
import { StudentsView } from "@/components/academy/StudentsView";
import { AssessView } from "@/components/academy/AssessView";
import { CoachesView } from "@/components/academy/CoachesView";
import { ReportView } from "@/components/academy/ReportView";
import { CurriculumView } from "@/components/academy/CurriculumView";
import { ScheduleView } from "@/components/academy/ScheduleView";
import { SettingsView } from "@/components/academy/SettingsView";
import { useAcademy } from "@/lib/academy-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoop Academy — Sistem Penilaian Basket" },
      {
        name: "description",
        content:
          "Kelola data siswa & coach, penilaian 5 pilar, absensi, rapor otomatis, dan kurikulum untuk academy basket.",
      },
      { property: "og:title", content: "Hoop Academy — Sistem Penilaian Basket" },
      {
        property: "og:description",
        content:
          "Dashboard academy 5 pilar + absensi terintegrasi, dengan Google Spreadsheet sync.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const { theme } = useAcademy();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto max-w-md px-4 pb-24 pt-6">
        {tab === "dashboard" && <DashboardView onGo={setTab} />}
        {tab === "students" && <StudentsView onBack={() => setTab("dashboard")} />}
        {tab === "assess" && <AssessView onBack={() => setTab("dashboard")} />}
        {tab === "coaches" && <CoachesView onBack={() => setTab("dashboard")} />}
        {tab === "report" && <ReportView onBack={() => setTab("dashboard")} />}
        {tab === "curriculum" && <CurriculumView onBack={() => setTab("dashboard")} />}
        {tab === "schedule" && <ScheduleView onBack={() => setTab("dashboard")} />}
        {tab === "settings" && <SettingsView onBack={() => setTab("dashboard")} />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
      <Toaster position="top-center" />
    </div>
  );
}
