import { useState } from "react";
import { addSchedule, deleteSchedule, useAcademy } from "@/lib/academy-store";
import { CLASSES, type ClassLevel } from "@/lib/academy-types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, CalendarPlus, MapPin, Clock, CalendarDays, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function ScheduleView({ onBack }: { onBack?: () => void }) {
  const { schedules } = useAcademy();
  const [open, setOpen] = useState(false);

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
          <h1 className="text-2xl font-black">Jadwal Latihan</h1>
          <p className="text-xs text-muted-foreground">Atur hari dan lokasi latihan per kelas.</p>
        </div>
      </header>

      <div className="grid gap-4">
        {(!schedules || schedules.length === 0) && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Belum ada jadwal latihan.
          </Card>
        )}

        {schedules?.map((s) => (
          <Card key={s.id} className="relative p-5 overflow-hidden flex flex-col border-2">
            <div className="absolute right-3 top-3">
              <button
                onClick={() => {
                  if (confirm("Hapus jadwal ini?")) {
                    deleteSchedule(s.id);
                    toast.success("Jadwal dihapus");
                  }
                }}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4 pr-10">
              {s.classes.map((c) => (
                <span
                  key={c}
                  className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Hari
                  </p>
                  <p className="font-bold text-foreground text-sm">{s.days.join(" & ")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Waktu
                  </p>
                  <p className="font-bold text-foreground text-sm">
                    {s.startTime} - {s.endTime} WIB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Lokasi
                  </p>
                  <p className="font-bold text-foreground text-sm">{s.location}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <CalendarPlus className="h-6 w-6" />
        </Button>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal</DialogTitle>
          </DialogHeader>
          <AddScheduleForm onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddScheduleForm({ onDone }: { onDone: () => void }) {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("SD Upper");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("15:30");
  const [endTime, setEndTime] = useState("17:00");
  const [location, setLocation] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!selectedClass || selectedDays.length === 0 || !location.trim()) {
          toast.error("Lengkapi semua data");
          return;
        }
        addSchedule({
          classes: [selectedClass],
          days: selectedDays,
          startTime,
          endTime,
          location: location.trim(),
        });
        toast.success("Jadwal ditambahkan");
        onDone();
      }}
      className="space-y-4 py-2"
    >
      <div className="space-y-2">
        <Label>Kelas / Kategori</Label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {CLASSES.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Hari Latihan</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg border border-transparent"
            >
              <Checkbox
                id={`sch-day-${day}`}
                checked={selectedDays.includes(day)}
                onCheckedChange={() => toggleDay(day)}
              />
              <label
                htmlFor={`sch-day-${day}`}
                className="text-sm font-medium leading-none cursor-pointer w-full"
              >
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Mulai</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Selesai</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Lokasi</Label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          placeholder="Lapangan Basket Hoo Tong Bio"
        />
      </div>

      <Button type="submit" className="w-full mt-4">
        Simpan Jadwal
      </Button>
    </form>
  );
}
