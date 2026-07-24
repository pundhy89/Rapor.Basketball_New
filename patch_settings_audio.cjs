const fs = require("fs");
const file = "src/components/academy/SettingsView.tsx";
let content = fs.readFileSync(file, "utf8");

// import useSyncExternalStore, audioManager, Trash, Upload, Music
content = content.replace(
  /import \{ ChevronLeft, Cloud, CloudDownload, Copy \} from "lucide-react";/,
  'import { ChevronLeft, Cloud, CloudDownload, Copy, Music, Upload, Trash, Play, Pause } from "lucide-react";\nimport { useSyncExternalStore } from "react";\nimport { audioManager } from "@/lib/audio-manager";',
);

const audioCard = `
      {/* Audio Settings Card */}
      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Musik BGM</p>
            <p className="text-[11px] text-muted-foreground">Upload mp3 untuk diputar di aplikasi</p>
          </div>
        </div>

        <AudioSettingsContent />
      </Card>
`;

content = content.replace(/(?=<Card className="p-4">)/, audioCard + "\n");

const audioComponent = `
function AudioSettingsContent() {
  const bgmFiles = useSyncExternalStore((l) => audioManager.subscribe(l), () => audioManager.getBgmFiles(), () => []);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("audio/")) {
      toast.error("Hanya file audio yang diizinkan");
      return;
    }
    
    try {
      const buffer = await file.arrayBuffer();
      await audioManager.addBgmFile(file.name, buffer);
      toast.success("Musik ditambahkan!");
    } catch (err) {
      toast.error("Gagal menambahkan musik");
      console.error(err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input 
          type="file" 
          accept="audio/*" 
          onChange={handleUpload} 
          className="text-xs file:h-full flex-1"
        />
      </div>
      
      {bgmFiles.length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-xs font-semibold">Daftar Musik ({bgmFiles.length})</p>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {bgmFiles.map((f, i) => (
              <div key={f.id} className="flex items-center justify-between bg-secondary/50 p-2 rounded text-xs">
                <span className="truncate flex-1 mr-2">{f.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => audioManager.playIndex(i)}>
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => audioManager.removeBgmFile(f.id)}>
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;

content = content + "\n" + audioComponent;

fs.writeFileSync(file, content);
