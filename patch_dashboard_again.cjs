const fs = require('fs');
const file = 'src/components/academy/DashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const isPlaying = useSyncExternalStore\(\s*\(l\) => audioManager\.subscribe\(l\),\s*\(\) => audioManager\.getIsPlaying\(\),\s*\);/m,
  'const isPlaying = useSyncExternalStore((l) => audioManager.subscribe(l), () => audioManager.getIsPlaying(), () => false);'
);

content = content.replace(
  /const trackName = useSyncExternalStore\(\s*\(l\) => audioManager\.subscribe\(l\),\s*\(\) => audioManager\.getCurrentTrackName\(\),\s*\);/m,
  'const trackName = useSyncExternalStore((l) => audioManager.subscribe(l), () => audioManager.getCurrentTrackName(), () => "");'
);

const playerUI = `
      {/* Music Player widget */}
      <section>
        <Card className="p-3 mb-3 bg-secondary/50 border flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Music className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">BGM Player</p>
              <p className="truncate text-sm font-semibold">{trackName || "Loading..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button onClick={() => audioManager.playPrev()} className="p-2 hover:bg-accent rounded-full transition-colors"><SkipBack className="h-4 w-4" /></button>
            <button onClick={() => audioManager.togglePlay()} className="p-2 hover:bg-accent rounded-full bg-primary/10 text-primary transition-colors">
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            </button>
            <button onClick={() => audioManager.playNext()} className="p-2 hover:bg-accent rounded-full transition-colors"><SkipForward className="h-4 w-4" /></button>
          </div>
        </Card>
      </section>
`;

// Remove old player widget
content = content.replace(/\{\/\* Music Player widget \*\/\}.*?(?=<div className="absolute top-2 right-0 z-50">)/s, '');
// For cases where it might match differently, let's just do a more robust string replacement
content = content.replace(/\{\/\* Music Player widget \*\/\}\s*<div className="absolute top-2 left-1\/2 -translate-x-1\/2 z-50">.*?<\/div>\s*<\/div>\s*/s, '');

content = content.replace(/<section>\s*<div className="mb-2 flex items-baseline justify-between">\s*<h2 className="text-sm font-bold">Distribusi Kelas<\/h2>/s, playerUI + '\n      <section>\n        <div className="mb-2 flex items-baseline justify-between">\n          <h2 className="text-sm font-bold">Distribusi Kelas</h2>');

fs.writeFileSync(file, content);
