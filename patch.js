const fs = require("fs");
const file = "src/components/academy/ScheduleView.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "const [selectedClasses, setSelectedClasses] = useState<ClassLevel[]>([]);",
  'const [selectedClass, setSelectedClass] = useState<ClassLevel>("SD Upper");',
);

content = content.replace(
  "if (selectedClasses.length === 0 || selectedDays.length === 0 || !location.trim()) {",
  "if (!selectedClass || selectedDays.length === 0 || !location.trim()) {",
);

content = content.replace("classes: selectedClasses,", "classes: [selectedClass],");

content = content.replace(
  /<div className="space-y-2">[\s\S]*?<Label>Kelas \/ Kategori<\/Label>[\s\S]*?<\/div>[\s\S]*?<\/div>/m,
  `<div className="space-y-2">
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
      </div>`,
);

fs.writeFileSync(file, content);
