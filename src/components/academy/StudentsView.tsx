import { useMemo, useState } from "react";
import { addStudent, updateStudent, deleteStudent, useAcademy } from "@/lib/academy-store";
import { CLASSES, type ClassLevel, type Student } from "@/lib/academy-types";
import { ClassFilter } from "./ClassFilter";
import { StudentDetail } from "./StudentDetail";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2, Edit2, Upload } from "lucide-react";
import { toast } from "sonner";

export function StudentsView({ onBack }: { onBack?: () => void }) {
  const { students } = useAcademy();
  const [filter, setFilter] = useState<ClassLevel | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  const list = useMemo(() => {
    return students
      .filter((s) => (filter === "all" ? true : s.className === filter))
      .filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, filter, q]);

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
          <h1 className="text-2xl font-black">Data Siswa</h1>
          <p className="text-xs text-muted-foreground">{students.length} pemain terdaftar</p>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama siswa..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>

      <ClassFilter value={filter} onChange={setFilter} />

      <div className="space-y-2">
        {list.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">Tidak ada siswa.</Card>
        )}
        {list.map((s) => (
          <Card key={s.id} className="flex items-center gap-3 p-3">
            <button
              onClick={() => setDetail(s)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary text-secondary-foreground relative">
                {s.photoUrl ? (
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-black">{s.jersey || s.name[0]}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.className}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingStudent(s);
                  setOpen(true);
                }}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus ${s.name}?`)) {
                    deleteStudent(s.id);
                    toast.success("Siswa dihapus");
                  }
                }}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditingStudent(undefined);
        }}
      >
        <Button
          className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          onClick={() => {
            setEditingStudent(undefined);
            setOpen(true);
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
          </DialogHeader>
          <AddStudentForm
            student={editingStudent}
            onDone={() => {
              setOpen(false);
              setEditingStudent(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <StudentDetail student={detail} open={!!detail} onOpenChange={(v) => !v && setDetail(null)} />
    </div>
  );
}

function AddStudentForm({ student, onDone }: { student?: Student; onDone: () => void }) {
  const [name, setName] = useState(student?.name || "");
  const [jersey, setJersey] = useState(student?.jersey || "");
  const [className, setClassName] = useState<ClassLevel>(student?.className || "SD Lower");
  const [nis, setNis] = useState(student?.nis || "");
  const [birthDate, setBirthDate] = useState(student?.birthDate || "");
  const [photoUrl, setPhotoUrl] = useState(student?.photoUrl || "");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File terlalu besar. Maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload = {
          name: name.trim(),
          jersey: jersey.trim() || undefined,
          className,
          nis: nis.trim() || undefined,
          birthDate: birthDate || undefined,
          photoUrl: photoUrl || undefined,
        };

        if (student) {
          updateStudent(student.id, payload);
          toast.success("Data siswa diperbarui");
        } else {
          addStudent(payload);
          toast.success("Siswa ditambahkan");
        }
        onDone();
      }}
      className="space-y-4 py-2"
    >
      <div className="flex justify-center">
        <label className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:bg-muted/50">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <Upload className="mb-2 h-6 w-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Foto</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
      </div>

      <div className="space-y-1.5">
        <Label>Nama Lengkap</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus={!student}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>NIS</Label>
          <Input value={nis} onChange={(e) => setNis(e.target.value)} placeholder="Mis: DRB-001" />
        </div>
        <div className="space-y-1.5">
          <Label>Tanggal Lahir</Label>
          <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>No. Jersey</Label>
          <Input value={jersey} onChange={(e) => setJersey(e.target.value)} inputMode="numeric" />
        </div>
        <div className="space-y-1.5">
          <Label>Kelas</Label>
          <Select value={className} onValueChange={(v) => setClassName(v as ClassLevel)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {student ? "Update Siswa" : "Simpan Siswa"}
      </Button>
    </form>
  );
}
