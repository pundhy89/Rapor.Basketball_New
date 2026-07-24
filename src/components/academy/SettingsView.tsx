import { useEffect, useState } from "react";

import { getGasUrl, pullFromGas, setGasUrl } from "@/lib/academy-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ChevronLeft,
  Cloud,
  CloudDownload,
  Copy,
  Music,
  Upload,
  Trash,
  Play,
  Pause,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { audioManager } from "@/lib/audio-manager";

const GAS_SCRIPT = `// === Google Apps Script — Hoop Academy Sync ===
// 1. Buka https://script.google.com  → New project
// 2. Paste kode ini, ganti SHEET_ID dengan ID Google Sheet Anda
// 3. Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Salin URL Web App-nya dan tempel di app ini (Settings → GAS URL)

const SHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'pull') {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const data = {
      students:    readSheet_(ss, 'students'),
      assessments: readSheet_(ss, 'assessments'),
      attendance:  readSheet_(ss, 'attendance'),
    };
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('OK');
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.action === 'sync') {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    writeSheet_(ss, 'students',    body.payload.students);
    writeSheet_(ss, 'assessments', body.payload.assessments.map(flatten_));
    writeSheet_(ss, 'attendance',  body.payload.attendance);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function flatten_(a){ return Object.assign({}, a, a.scores); }

function writeSheet_(ss, name, rows) {
  let sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  sh.appendRow(headers);
  sh.getRange(2, 1, rows.length, headers.length)
    .setValues(rows.map(r => headers.map(h => r[h] ?? '')));
}

function readSheet_(ss, name) {
  const sh = ss.getSheetByName(name);
  if (!sh) return [];
  const [headers, ...rows] = sh.getDataRange().getValues();
  return rows.filter(r => r[0]).map(r =>
    Object.fromEntries(headers.map((h, i) => [h, r[i]]))
  );
}`;

export function SettingsView({ onBack }: { onBack?: () => void }) {
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(getGasUrl()), []);

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
          <h1 className="text-2xl font-black">Pengaturan</h1>
          <p className="text-xs text-muted-foreground">Konfigurasi Aplikasi</p>
        </div>
      </header>

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Google Apps Script URL</p>
            <p className="text-[11px] text-muted-foreground">Endpoint Web App untuk sync data</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Web App URL</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setGasUrl(url.trim());
              toast.success("URL disimpan");
            }}
          >
            Simpan URL
          </Button>
          <Button
            onClick={async () => {
              setGasUrl(url.trim());
              const ok = await pullFromGas();
              toast[ok ? "success" : "error"](
                ok ? "Data ditarik dari Spreadsheet" : "Gagal tarik data",
              );
            }}
          >
            <CloudDownload className="mr-1.5 h-4 w-4" /> Pull
          </Button>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Setiap perubahan otomatis dikirim ke Spreadsheet (POST). Gunakan Pull untuk menarik data
          terbaru dari Sheet ke app.
        </p>
      </Card>

      {/* Audio Settings Card */}
      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Musik BGM</p>
            <p className="text-[11px] text-muted-foreground">
              Upload mp3 untuk diputar di aplikasi
            </p>
          </div>
        </div>

        <AudioSettingsContent />
      </Card>

      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold">Kode Apps Script</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(GAS_SCRIPT);
              toast.success("Kode disalin");
            }}
            className="flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground"
          >
            <Copy className="h-3 w-3" /> Salin
          </button>
        </div>
        <pre className="max-h-72 overflow-auto rounded-lg bg-secondary p-3 text-[10px] leading-relaxed text-secondary-foreground">
          {GAS_SCRIPT}
        </pre>
      </Card>

      <Card className="space-y-1 p-4 text-xs text-muted-foreground">
        <p className="font-bold text-foreground">Cara pakai singkat:</p>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Buat Google Sheet baru, salin ID-nya dari URL.</li>
          <li>Buka Extensions → Apps Script, paste kode di atas.</li>
          <li>
            Ganti <code className="rounded bg-accent px-1">SHEET_ID</code> dengan ID sheet.
          </li>
          <li>Deploy sebagai Web App (Anyone), salin URL.</li>
          <li>Tempel URL di kolom di atas, lalu Simpan.</li>
        </ol>
      </Card>
    </div>
  );
}

function AudioSettingsContent() {
  const bgmFiles = useSyncExternalStore(
    (l) => audioManager.subscribe(l),
    () => audioManager.getBgmFiles(),
    () => [],
  );

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
              <div
                key={f.id}
                className="flex items-center justify-between bg-secondary/50 p-2 rounded text-xs"
              >
                <span className="truncate flex-1 mr-2">{f.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => audioManager.playIndex(i)}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => audioManager.removeBgmFile(f.id)}
                  >
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
