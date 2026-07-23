import { useState } from "react";
import { addCoach, updateCoach, deleteCoach, useAcademy } from "@/lib/academy-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { CLASSES, type ClassLevel, type Coach } from "@/lib/academy-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ChevronLeft,
  Plus,
  Trash2,
  UserCog,
  Upload,
  IdCard,
  Phone,
  Award,
  Users,
  ShieldCheck,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";

export function CoachesView({ onBack }: { onBack?: () => void }) {
  const { coaches, assessments, attendance } = useAcademy();
  const [open, setOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | undefined>(undefined);

  const countFor = (id: string) => ({
    assess: assessments.filter((a) => a.coachId === id).length,
    att: attendance.filter((a) => a.coachId === id).length,
  });

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
          <h1 className="text-2xl font-black">Data Coach</h1>
          <p className="text-xs text-muted-foreground">
            {coaches.length} coach · validator penilaian & absensi
          </p>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {coaches.length === 0 && (
          <Card className="col-span-full p-6 text-center text-sm text-muted-foreground">
            Belum ada coach terdaftar.
          </Card>
        )}
        {coaches.map((c) => {
          const nameParts = c.name.split(" ");
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(" ");

          return (
            <Card
              key={c.id}
              className="relative overflow-hidden bg-card border-2 flex flex-col shadow-md"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500 rounded-br-[100px] -translate-x-8 -translate-y-8 opacity-10 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500 rounded-tl-[100px] translate-x-12 translate-y-12 opacity-10 pointer-events-none" />

              <div className="relative p-6 flex flex-col items-center border-b">
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCoach(c);
                      setOpen(true);
                    }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-background/50 backdrop-blur-sm text-muted-foreground hover:bg-primary/10 hover:text-primary z-10 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus ${c.name}?`)) {
                        deleteCoach(c.id);
                        toast.success("Coach dihapus");
                      }
                    }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-background/50 backdrop-blur-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive z-10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-28 w-28 rounded-full border-[3px] border-orange-500 p-1 mb-4 relative z-10 bg-background shadow-sm">
                  {c.photoUrl ? (
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <UserCog className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="bg-foreground text-background px-4 py-1 font-black tracking-widest uppercase text-xs rounded mb-3 relative z-10">
                  {c.role || "COACH"}
                </div>

                <h2 className="text-2xl font-black uppercase text-center relative z-10 leading-none">
                  <span className="text-orange-500">{firstName}</span>{" "}
                  {lastName && <span className="text-foreground">{lastName}</span>}
                </h2>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4 relative z-10 bg-muted/10">
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500 text-white shadow-sm">
                    <IdCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      ID Coach
                    </p>
                    <p className="font-bold text-orange-500 dark:text-orange-400 text-sm tracking-wide">
                      {c.coachId || "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-border/60" />

                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Nomor HP
                    </p>
                    <p className="font-bold text-orange-500 dark:text-orange-400 text-sm tracking-wide">
                      {c.phone || "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-border/60" />

                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Sertifikasi
                    </p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm tracking-wide uppercase">
                      {c.certification || "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-border/60" />

                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-background shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Kelas Yang Dilatih
                    </p>
                    <p className="font-bold text-orange-500 dark:text-orange-400 text-sm tracking-wide uppercase">
                      {c.classes && c.classes.length > 0 ? c.classes.join(", ") : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-2 mt-auto relative z-10 bg-muted/10">
                <div className="flex items-center justify-center gap-3 rounded-full border-2 border-border/60 py-2.5 bg-background shadow-sm">
                  <ShieldCheck
                    className={`h-5 w-5 ${c.isActive ? "text-orange-500" : "text-muted-foreground"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </span>
                  <span className="w-px h-5 bg-border"></span>
                  <span
                    className={`text-base font-black uppercase tracking-wider ${c.isActive ? "text-orange-500" : "text-muted-foreground"}`}
                  >
                    {c.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditingCoach(undefined);
        }}
      >
        <Button
          className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          onClick={() => {
            setEditingCoach(undefined);
            setOpen(true);
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoach ? "Edit Coach" : "Tambah Coach"}</DialogTitle>
          </DialogHeader>
          <AddCoachForm
            coach={editingCoach}
            onDone={() => {
              setOpen(false);
              setEditingCoach(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddCoachForm({ coach, onDone }: { coach?: Coach; onDone: () => void }) {
  const [name, setName] = useState(coach?.name || "");
  const [role, setRole] = useState(coach?.role || "");
  const [coachId, setCoachId] = useState(coach?.coachId || "");
  const [phone, setPhone] = useState(coach?.phone || "");
  const [certification, setCertification] = useState(coach?.certification || "");
  const [photoUrl, setPhotoUrl] = useState(coach?.photoUrl || "");
  const [isActive, setIsActive] = useState(coach?.isActive ?? true);
  const [selectedClasses, setSelectedClasses] = useState<ClassLevel[]>(coach?.classes || []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleClass = (cls: ClassLevel) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls],
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload = {
          name: name.trim(),
          role: role.trim() || undefined,
          coachId: coachId.trim() || undefined,
          phone: phone.trim() || undefined,
          certification: certification.trim() || undefined,
          photoUrl: photoUrl || undefined,
          classes: selectedClasses,
          isActive,
        };

        if (coach) {
          updateCoach(coach.id, payload);
          toast.success("Data coach diperbarui");
        } else {
          addCoach(payload);
          toast.success("Coach ditambahkan");
        }

        onDone();
      }}
      className="space-y-4 py-2"
    >
      <div className="flex justify-center mb-4">
        <label className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <>
              <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Upload Foto</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Nama Coach</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Budi Santoso"
          />
        </div>
        <div className="space-y-1.5">
          <Label>ID Coach (opsional)</Label>
          <Input value={coachId} onChange={(e) => setCoachId(e.target.value)} placeholder="C-001" />
        </div>

        <div className="space-y-1.5">
          <Label>Peran (opsional)</Label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Head Coach / Assistant"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Nomor HP (opsional)</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08123456789"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Sertifikasi (opsional)</Label>
          <Input
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
            placeholder="Lisensi C FIBA / Nasional"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Kelas yang dilatih</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {CLASSES.map((cls) => (
              <div
                key={cls}
                className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg border border-transparent"
              >
                <Checkbox
                  id={`class-${cls}`}
                  checked={selectedClasses.includes(cls)}
                  onCheckedChange={() => toggleClass(cls)}
                />
                <label
                  htmlFor={`class-${cls}`}
                  className="text-sm font-medium leading-none cursor-pointer w-full"
                >
                  {cls}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between sm:col-span-2 rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label>Status Aktif</Label>
            <p className="text-[11px] text-muted-foreground">
              Apakah coach ini masih aktif mengajar?
            </p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <Button type="submit" className="w-full mt-2">
        Simpan Coach
      </Button>
    </form>
  );
}
