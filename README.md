# NulisSaja

Plugin Obsidian untuk pembuatan catatan cepat dengan sistem PARA, template otomatis, dan UI adaptif.

![Obsidian](https://img.shields.io/badge/Obsidian-v1.0+-7C3AED?logo=obsidian&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## Fitur Utama

### Quick Menu Adaptif
- **Desktop**: Command Palette dengan keyboard navigation dan search
- **Mobile**: Bottom Sheet dengan swipe gestures dan touch-friendly cards
- **Auto-detect**: Otomatis memilih mode berdasarkan perangkat

### 4 Kategori Catatan
| Kategori | Jenis Catatan |
|----------|---------------|
| **Harian** | Daily Note, Journal |
| **Capture** | Ideas, Catatan Umum |
| **Knowledge** | Pengetahuan, Zettelkasten |
| **PARA** | Projects, Areas, Resources |

### Template System
- Template otomatis untuk 9 jenis catatan
- Koleksi template per bahasa (ID/EN)
- Format tanggal ISO untuk kompatibilitas Bases plugin
- Variabel: `{{title}}`, `{{date_iso}}`, `{{date}}`

### Pengaturan Lengkap
- Visibility toggle per item menu
- Kustomisasi folder dan template
- Format tanggal fleksibel
- Hotkey per jenis catatan

## Instalasi

### Manual
```bash
# Clone repository
git clone https://github.com/dwirx/NulisSaja.git

# Masuk ke folder
cd NulisSaja

# Install dependencies
npm install

# Build
npm run build
```

Copy `main.js`, `manifest.json`, dan `styles.css` ke:
```
<Vault>/.obsidian/plugins/nulisaja/
```

### Dari Obsidian
1. Settings → Community Plugins → Browse
2. Cari "NulisSaja"
3. Install dan Enable

## Penggunaan

### Quick Menu
- **Ribbon**: Klik ikon pen di sidebar kiri
- **Command**: `Ctrl/Cmd + P` → "Nulisaja: Open Quick Menu"
- **Hotkey**: Atur di Settings

### Keyboard Shortcuts (Desktop)
| Key | Action |
|-----|--------|
| `↑` `↓` | Navigasi item |
| `Enter` | Pilih item |
| `Esc` | Tutup menu |
| `Type` | Filter/search |

### Gestures (Mobile)
- **Tap**: Pilih item
- **Swipe down**: Tutup menu

## Konfigurasi

Settings → Community Plugins → NulisSaja

### Quick Menu
- **Mode**: Auto / Command Palette / Bottom Sheet
- **Visibility**: Toggle tampilan per item

### Folders
```
Daily/       → Catatan harian
Knowledge/   → Pengetahuan
Ide/         → Brainstorming
Notes/       → Catatan umum
PROJECTS/    → Proyek aktif
AREAS/       → Area tanggung jawab
RESOURCES/   → Referensi
IDEAS/       → Zettelkasten
journal/     → Jurnal pribadi
```

### Templates
Gunakan variabel:
- `{{title}}` - Judul catatan
- `{{date_iso}}` - Tanggal ISO (2026-01-21)
- `{{date}}` - Tanggal format lokal

## Development

```bash
# Install
npm install

# Dev mode (watch)
npm run dev

# Build production
npm run build

# Type check
npx tsc --noEmit
```

## Struktur Project

```
src/
├── main.ts              # Entry point
├── types.ts             # Type definitions
├── settings.ts          # Default settings
├── settingsTab.ts       # Settings UI
├── styles.ts            # CSS styles
├── commands/
│   ├── noteDefinitions.ts
│   ├── noteRunner.ts
│   └── registerCommands.ts
├── services/
│   └── noteService.ts   # Note creation logic
├── ui/
│   ├── quickMenu/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── commandPalette.ts
│   │   └── bottomSheet.ts
│   └── titlePrompt.ts
└── utils/
    └── date.ts
```

## Changelog

### v1.1.0
- Dual-mode Quick Menu (Command Palette + Bottom Sheet)
- 4 kategori dengan grouping visual
- Visibility settings per item
- Fix date format untuk Bases plugin compatibility

### v1.0.0
- Initial release
- 9 jenis catatan dengan template
- Multi-language support (ID/EN)
- Template collections

## License

MIT License - Lihat [LICENSE](LICENSE) untuk detail.

## Author

**dwirx** - [GitHub](https://github.com/dwirx)
