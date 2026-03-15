# SRC-RENDERER (NUXT FRONTEND)

## OVERVIEW

Nuxt 4 frontend with Vue 3 Composition API, Pinia 3 stores with Tauri persistence, TailwindCSS 4 / DaisyUI 5 styling, Reka UI headless primitives.

## STRUCTURE

```
src-renderer/
├── app.vue           # Root component (<NuxtPage />)
├── app.config.ts     # App config (title, snapEdgeSize, default_language)
├── index.d.ts        # Global type declarations (Translate namespace)
├── components.d.ts   # Auto-generated component type declarations
├── pages/            # File-based routing
│   ├── index.vue     # Landing / redirect
│   ├── home.vue      # Main home page (sidebar layout)
│   ├── home/         # Nested home routes
│   │   ├── services.vue  # Translation service management
│   │   ├── models.vue    # Model configuration
│   │   ├── about.vue     # About page
│   │   ├── backup.vue    # (stub) Backup settings
│   │   ├── settings.vue  # (stub) App settings
│   │   └── quick-input.vue # (stub) Quick input
│   ├── translate.vue # Translation window UI
│   ├── playground.vue# Dev playground
│   ├── test.vue      # Test page
│   ├── test-cmds.vue # Tauri command testing
│   └── debug-lab.vue # Debug lab (dev-only, Alt+L)
├── components/       # By domain
│   ├── Base/         # Reusable: AlertDialog.vue, Toolsbar.vue
│   ├── Translate/    # Input, Output, OutputTabs, LangSelect, TypeSelect, TypeIcon, Toolsbar, Volume
│   ├── Home/         # Component/, Services/ subdirectories
│   ├── Win/          # TitleBar.vue, TitleBarDefault.vue
│   ├── Markdown.vue  # Markdown renderer (highlight.js + markdown-it)
│   ├── TextAutosize.vue # Auto-resizing textarea
│   ├── SvgsIcon.vue  # Custom SVG icon component
│   ├── SideListItem.vue # Sidebar list item
│   └── Alert.vue     # Alert component
├── stores/           # Pinia setup stores
│   ├── translate.ts  # Translation state (languages, input, output tabs)
│   └── translate-api.ts # Channel CRUD (AddChannel, UpdateChannel, DeleteChannel)
├── plugins/          # Numbered load order
│   ├── 01.global.ts  # $media, $translateType, $rootFontSize
│   ├── 02.tauriapi.ts # $tauri (Tauri class: window ops, clipboard, events)
│   ├── 03.0.pinia.ts # Pinia persistence setup
│   ├── 03.translate.ts # $translate (Translate class: API invoke wrappers)
│   └── index.d.ts    # NuxtApp type augmentation
├── layouts/          # Page layouts
│   ├── default.vue   # Passthrough layout
│   ├── main.vue      # Sidebar layout
│   ├── container.vue # Container layout
│   ├── titlebar.vue  # Custom title bar layout
│   └── notstyle.vue  # Unstyled layout
├── i18n/locales/     # en.json, zh.json (default: zh)
├── assets/
│   ├── css/main.css  # Tailwind entry + custom styles
│   └── icons/        # Provider logos (baidu, deepl, google, chatgpt, app icons)
├── composables/      # (empty — Vue composables go here)
├── modules/          # (empty — custom Nuxt modules go here)
├── utils/            # constants.ts (TranslateApiType enum)
├── archive/          # Deprecated/archived code
└── public/           # Static assets
```

## WHERE TO LOOK

| Task                      | File                        | Notes                                        |
| ------------------------- | --------------------------- | -------------------------------------------- |
| Add page                  | `pages/[name].vue`          | Auto-routed, use layouts                     |
| Add component             | `components/[Domain]/`      | Base for reusable, feature-name for specific |
| Add store state           | `stores/translate.ts`       | Composition API, auto-persisted              |
| Add translation channel   | `stores/translate-api.ts`   | CRUD via AddChannel/UpdateChannel            |
| Add Tauri command wrapper | `plugins/03.translate.ts`   | invoke() with typed params                   |
| Add i18n string           | `i18n/locales/*.json`       | Both en.json and zh.json                     |
| Add custom icon           | `assets/icons/*.svg`        | Auto-resolved via `icon-svgs-*`              |
| Add composable            | `composables/[name].ts`     | Auto-imported by Nuxt                        |
| Add type declarations     | `index.d.ts`                | Global Translate namespace                   |
| Augment NuxtApp           | `plugins/index.d.ts`        | Add new provides to NuxtApp interface        |

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
- **Typography plugin**: `@tailwindcss/typography` available

### Icons

- **Iconify collections**: clarity, eva, fluent, gravity-ui, heroicons, heroicons-solid, ic, lets-icons, material-symbols-light, mdi
- **Usage**: `<icon-clarity-pin-line />` (auto-resolved with `icon-` prefix)
- **Custom SVG**: `<SvgsIcon name="iconname" />` or `<icon-svgs-iconname />`
- **Custom icons dir**: `assets/icons/` (auto-processed: fill→currentColor, size removed)

### Tauri Integration

- **Plugin**: `$tauri` (window ops, settings, clipboard, events), `$translate` (API commands)
- **Events**: Listen via `$tauri.listen_event()` (cpcp event), emit via `getCurrent().emit()`
- **Store**: `$tauri.getAppStore(key)` / `$tauri.setAppStore(key, value)` for Tauri Store

### Stores

- **Translate store**: selectedTranslateTypes, sourceLanguage, targetLanguage, sourceInput, output tabs
- **Translate API store**: Channel CRUD with UUID v7 generation
- **Persistence**: Auto via `@tauri-store/pinia` (plugin `03.0.pinia.ts`)

### TranslateApiType Enum

```typescript
enum TranslateApiType {
  OpenAI = 'openai',
  DeepL = 'deepl',
  Google = 'google',
  Baidu = 'baidu',
  Youdao = 'youdao',
  Custom = 'custom'
}
```

## ANTI-PATTERNS

| NEVER                                   | Why                                       |
| --------------------------------------- | ----------------------------------------- |
| Use Options API                         | Project uses Composition API exclusively  |
| Skip `storeToRefs()`                    | Loses reactivity when destructuring store |
| Hardcode user-facing strings            | Use `$t('key')` for all user-facing text  |
| Use raw Tailwind for DaisyUI components | Breaks theme consistency                  |
| Use `any` type                          | Bypasses TypeScript safety                |
| Import Tauri APIs directly in components| Use `$tauri` / `$translate` plugins       |
