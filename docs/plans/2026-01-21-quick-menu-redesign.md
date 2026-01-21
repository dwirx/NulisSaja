# Quick Menu Redesign - Nulisaja Plugin

## Ringkasan

Redesign Quick Menu dengan pendekatan **adaptive dual-mode UI** yang responsive dan mobile-compatible.

## Keputusan Desain

### 1. Dual-Mode UI (Adaptive)
- **Desktop**: Command Palette style dengan search
- **Mobile**: Bottom Sheet style dengan swipe gestures

### 2. Pengelompokan Kategori (4 Kategori)

| Kategori | Icon | Items |
|----------|------|-------|
| Harian | 📆 | Daily, Journal |
| Capture | 💡 | Ideas, Brainstorm, Notes |
| Knowledge | 🧠 | Knowledge, Zettelkasten |
| PARA | 📁 | Projects, Areas, Resources |

### 3. Full Customization di Settings
- Toggle visibility per item
- Ubah urutan (drag & drop)
- Rename label
- Custom icon (emoji picker)
- Buat kategori baru

---

## Desain Detail

### Desktop Mode - Command Palette

```
┌────────────────────────────────────┐
│ 🔍 Ketik untuk mencari...          │
├────────────────────────────────────┤
│ 📆 HARIAN                      [−] │
│   📅 Daily Note                    │
│   📖 Journal                       │
├────────────────────────────────────┤
│ 💡 CAPTURE                     [−] │
│   💡 Ideas                         │
│   💭 Brainstorm                    │
│   📝 Notes                         │
├────────────────────────────────────┤
│ 🧠 KNOWLEDGE                   [−] │
│   🧠 Knowledge                     │
│   💭 Zettelkasten                  │
├────────────────────────────────────┤
│ 📁 PARA                        [−] │
│   🚀 Projects                      │
│   🎯 Areas                         │
│   📚 Resources                     │
└────────────────────────────────────┘
```

**Fitur:**
- Keyboard navigation: ↑↓ untuk navigasi, Enter untuk select
- Fuzzy search: ketik untuk filter items
- Collapse/expand kategori dengan klik header
- Escape untuk close
- Focus trap dalam modal

### Mobile Mode - Bottom Sheet

```
┌─────────────────────────────────────┐
│              ═══════                │  ← drag handle
│         ✨ Buat Catatan             │
├─────────────────────────────────────┤
│ 📆 Harian                           │
│ ┌─────────┐  ┌─────────┐            │
│ │   📅    │  │   📖    │            │
│ │  Daily  │  │ Jurnal  │            │
│ └─────────┘  └─────────┘            │
│                                     │
│ 💡 Capture                          │
│ ┌─────────┐  ┌─────────┐  ┌───────┐ │
│ │   💡    │  │   💭    │  │  📝   │ │
│ │  Ideas  │  │Brainstorm│ │ Notes │ │
│ └─────────┘  └─────────┘  └───────┘ │
│                                     │
│ 🧠 Knowledge                        │
│ ┌─────────┐  ┌─────────┐            │
│ │   🧠    │  │   💭    │            │
│ │Knowledge│  │  Zettel │            │
│ └─────────┘  └─────────┘            │
│                                     │
│ 📁 PARA                             │
│ ┌─────────┐  ┌─────────┐  ┌───────┐ │
│ │   🚀    │  │   🎯    │  │  📚   │ │
│ │Projects │  │  Areas  │  │Resource│ │
│ └─────────┘  └─────────┘  └───────┘ │
└─────────────────────────────────────┘
```

**Fitur:**
- Swipe up: expand ke full height
- Swipe down: collapse/close
- Touch-friendly: min 48px touch target
- Spring animation untuk smooth feel
- Backdrop blur overlay
- Card-based layout dengan grid responsive

### Device Detection

```typescript
function isMobileDevice(): boolean {
  // Check Obsidian Platform API first
  if (Platform.isMobile) return true;

  // Fallback: viewport width + touch capability
  return window.innerWidth <= 768 &&
         ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}
```

---

## Settings UI untuk Kustomisasi

### Tab: Quick Menu

```
┌─────────────────────────────────────────────────┐
│ Quick Menu Settings                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Mode                                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ ○ Auto (Desktop/Mobile)  ← recommended      │ │
│ │ ○ Always Command Palette                    │ │
│ │ ○ Always Bottom Sheet                       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Visible Items                    [Reset Default]│
│ ┌─────────────────────────────────────────────┐ │
│ │ 📆 Harian                              [≡]  │ │
│ │   ☑ 📅 Daily Note                      [≡]  │ │
│ │   ☑ 📖 Journal                         [≡]  │ │
│ │                                             │ │
│ │ 💡 Capture                             [≡]  │ │
│ │   ☑ 💡 Ideas                           [≡]  │ │
│ │   ☐ 💭 Brainstorm          (hidden)    [≡]  │ │
│ │   ☑ 📝 Notes                           [≡]  │ │
│ │ ...                                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [+ Add Custom Category]                         │
│                                                 │
│ Customize Item                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Select item above to customize              │ │
│ │ • Label: ___________                        │ │
│ │ • Icon:  [📅] [Pick Emoji]                  │ │
│ │ • Category: [Dropdown]                      │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Struktur File Baru

```
src/
├── ui/
│   ├── quickMenu/
│   │   ├── index.ts              # Main export, device detection
│   │   ├── commandPalette.ts     # Desktop mode
│   │   ├── bottomSheet.ts        # Mobile mode
│   │   ├── menuItem.ts           # Shared item component
│   │   ├── categoryGroup.ts      # Category grouping logic
│   │   └── types.ts              # QuickMenu-specific types
│   └── settings/
│       ├── quickMenuSettings.ts  # Quick menu customization UI
│       └── emojiPicker.ts        # Simple emoji picker
├── types.ts                      # Add new types for categories
├── constants/
│   └── categories.ts             # Default category definitions
└── styles/
    ├── commandPalette.css        # Desktop styles
    └── bottomSheet.css           # Mobile styles
```

---

## Data Types

```typescript
interface QuickMenuCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
  collapsed?: boolean;
}

interface QuickMenuItem {
  id: string;
  noteType: NoteType;
  label: string;
  icon: string;
  categoryId: string;
  visible: boolean;
  order: number;
}

interface QuickMenuSettings {
  mode: 'auto' | 'command-palette' | 'bottom-sheet';
  categories: QuickMenuCategory[];
  items: QuickMenuItem[];
  animations: boolean;
  showSearch: boolean;
}
```

---

## Animasi

### Desktop (Command Palette)
- Fade in: 150ms ease-out
- Fade out: 100ms ease-in
- Item hover: subtle background transition 100ms
- Search filter: items fade in/out 100ms

### Mobile (Bottom Sheet)
- Spring animation: tension 300, friction 20
- Backdrop: fade 200ms
- Swipe velocity threshold: 500px/s untuk auto-close
- Bounce effect saat hit top/bottom

---

## Implementasi Phases

### Phase 1: Core Refactor
1. Buat struktur folder baru `src/ui/quickMenu/`
2. Extract types ke `types.ts`
3. Buat `categoryGroup.ts` untuk logic kategori

### Phase 2: Desktop Mode
1. Implementasi `commandPalette.ts`
2. Keyboard navigation
3. Fuzzy search
4. Collapse/expand kategori

### Phase 3: Mobile Mode
1. Implementasi `bottomSheet.ts`
2. Touch gestures (swipe up/down)
3. Spring animations
4. Grid card layout

### Phase 4: Settings UI
1. Quick Menu settings tab
2. Drag & drop reorder
3. Visibility toggles
4. Label/icon customization
5. Category management

### Phase 5: Polish
1. Testing di berbagai device
2. Performance optimization
3. Accessibility (ARIA, keyboard)
4. Documentation update
