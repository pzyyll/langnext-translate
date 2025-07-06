# Gemini Project: lexin-tauri-nuxt

## Project Overview

This is a desktop application built using the Tauri framework. The frontend is developed with Nuxt.js 3 and Vue.js, while the backend is written in Rust. The application appears to be a translation tool, given the dependencies and file names.

## Core Technologies

- **Frameworks**: Tauri 2 (for desktop app shell), Nuxt.js 3 (for frontend)
- **Backend Language**: Rust
- **Frontend Language**: TypeScript, Vue.js
- **Styling**: TailwindCSS, DaisyUI
- **State Management**: Pinia (inferred from `stores` directory)
- **Internationalization**: `@nuxtjs/i18n`
- **Package Manager**: bun

## Project Structure

- `src-renderer/`: Contains the Nuxt.js frontend application.
  - `components/`: Reusable Vue components.
  - `pages/`: Application pages/routes.
  - `stores/`: Pinia state management stores.
  - `plugins/`: Nuxt plugins.
- `src-tauri/`: Contains the Rust backend application.
  - `src/main.rs`: The main entry point for the Rust application.
  - `src/cmds/`: Custom Tauri commands exposed to the frontend.
  - `Cargo.toml`: Rust dependencies and project configuration.
- `nuxt.config.ts`: Nuxt.js configuration file.
- `package.json`: Node.js dependencies and scripts.

## Development Workflow

To run the application in development mode, which enables hot-reloading for both the frontend and backend, use the following command:

```bash
bun tauri:dev
```

## Build Process

To build the application for production, which will create a standalone executable, use the following command:

```bash
bun tauri:build
```

## Key Commands

- `bun dev`: Starts the Nuxt.js development server.
- `bun build`: Builds the Nuxt.js application for production.
- `bun generate`: Generates a static Nuxt.js site.
- `bun tauri:dev`: Runs the Tauri application in development mode.
- `bun tauri:build`: Builds the Tauri application for production.
