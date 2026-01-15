# SRC-RENDERER (NUXT FRONTEND)

## OVERVIEW

Nuxt 4 frontend with Vue 3 Composition API, Pinia stores, TailwindCSS/DaisyUI styling.

## STRUCTURE

```
src-renderer/
├── pages/            # File-based routing (home/, translate.vue)
├── components/       # By domain: Base/, Home/, Translate/, Win/
├── stores/           # Pinia setup stores (translate.ts, translate-api.ts)
├── plugins/          # Numbered load order (01.global → 02.tauriapi → 03.*)
├── layouts/          # main.vue (sidebar), default.vue (passthrough)
├── i18n/locales/     # en.json, zh.json (default: zh)
├── assets/           # css/main.css (Tailwind), icons/ (custom SVGs)
└── utils/            # constants.ts (TranslateApiType enum)
```

## WHERE TO LOOK

| Task                      | File                      | Notes                                        |
| ------------------------- | ------------------------- | -------------------------------------------- |
| Add page                  | `pages/[name].vue`        | Auto-routed, use layouts                     |
| Add component             | `components/[Domain]/`    | Base for reusable, feature-name for specific |
| Add store state           | `stores/translate.ts`     | Composition API, auto-persisted              |
| Add translation channel   | `stores/translate-api.ts` | CRUD via AddChannel/UpdateChannel            |
| Add Tauri command wrapper | `plugins/03.translate.ts` | invoke() with typed params                   |
| Add i18n string           | `i18n/locales/*.json`     | Both en.json and zh.json                     |
| Add custom icon           | `assets/icons/*.svg`      | Auto-resolved via `icon-svgs-*`              |

## CONVENTIONS

### Components

- **Props**: `defineProps<{ prop: Type }>()` (TypeScript-first)
- **Models**: `defineModel<T>()` for v-model
- **Emits**: `defineEmits<{ event: [payload] }>()`
- **Refs**: `useTemplateRef<HTMLElement>('name')`

### Styling

- **DaisyUI prefix**: `du-btn`, `du-card`, `du-input`, `du-toggle`
- **Base colors**: `bg-base-100`, `text-base-content`, `border-base-300`
- **Themes**: bumblebee (light), dracula (dark)

### Icons

- **Iconify**: `<icon-clarity-pin-line />` (auto-resolved)
- **Custom SVG**: `<SvgsIcon name="iconname" />` or `<icon-svgs-iconname />`

### Tauri Integration

- **Plugin**: `$tauri` (window ops, settings), `$translate` (API commands)
- **Events**: Listen via `$tauri.listen_event()`, emit to Rust

## ANTI-PATTERNS

| NEVER                                   | Why                                       |
| --------------------------------------- | ----------------------------------------- |
| Use Options API                         | Project uses Composition API exclusively  |
| Skip `storeToRefs()`                    | Loses reactivity when destructuring store |
| Hardcode strings                        | Use `$t('key')` for all user-facing text  |
| Use raw Tailwind for DaisyUI components | Breaks theme consistency                  |
