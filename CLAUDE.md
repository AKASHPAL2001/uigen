# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI to generate React components based on natural language descriptions, displays them in a live preview using a virtual file system, and allows users to iterate on the components through chat.

## Commands

### Setup
```bash
npm run setup        # Install dependencies + Prisma generate + run migrations
```

### Development
```bash
npm run dev          # Start Next.js dev server with Turbopack
npm run dev:daemon   # Start dev server in background, logs to logs.txt
npm run build        # Build production bundle
npm run start        # Start production server
```

### Testing & Quality
```bash
npm run test         # Run Vitest tests
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run database migrations
npm run db:reset         # Reset database (force)
```

## Architecture

### Virtual File System (VFS)
The core of UIGen is a client-side virtual file system that stores generated code in memory without writing to disk. Key files:

- `src/lib/file-system.ts` - VirtualFileSystem class with file operations (create, read, update, delete, rename)
- Files are stored as a Map and serialized to JSON for persistence in Prisma database
- The VFS supports hierarchical directory structure with path normalization

### AI Integration & Tool System
The app uses Vercel AI SDK with Anthropic Claude to generate components:

- `src/app/api/chat/route.ts` - Streaming API route that sends VFS state to Claude
- `src/lib/tools/str-replace.ts` - Text editor tool for Claude to create/edit files (view, create, str_replace, insert commands)
- `src/lib/tools/file-manager.ts` - File management tool for Claude (rename, delete commands)
- `src/lib/provider.ts` - Language model provider with MockLanguageModel fallback when ANTHROPIC_API_KEY is missing
- `src/lib/prompts/generation.tsx` - System prompt instructs Claude to create React components in VFS with @/ import alias

### Live Preview System
Components are rendered in an iframe using ES modules and import maps:

- `src/lib/transform/jsx-transformer.ts` - Transforms JSX/TSX to JS using Babel, creates import maps, generates preview HTML
- `src/components/preview/PreviewFrame.tsx` - Iframe component that renders the preview HTML
- Uses esm.sh CDN for React and third-party dependencies
- Supports @/ alias for local imports (maps to root directory)
- Entry point is always `/App.jsx`

### Context System
The app uses React Context to manage state:

- `src/lib/contexts/file-system-context.tsx` - FileSystemProvider manages VFS state, selected file, and handles AI tool calls
- `src/lib/contexts/chat-context.tsx` - ChatProvider wraps Vercel AI SDK's useChat, passes VFS to API, syncs tool calls with FileSystemProvider

### Authentication & Persistence
- `src/lib/auth.ts` - JWT-based authentication using jose library
- `prisma/schema.prisma` - SQLite database with User and Project models
- Projects store serialized VFS state and chat messages
- Anonymous users can work locally; work is tracked in localStorage for migration on signup

### UI Components
- `src/components/chat/` - Chat interface with message list, input, and markdown rendering
- `src/components/editor/` - File tree and Monaco code editor
- `src/components/ui/` - shadcn/ui components (buttons, dialogs, tabs, etc.)
- Uses Tailwind CSS v4 for styling

## Key Patterns

### Tool Call Flow
1. User sends message → ChatContext → `/api/chat`
2. API serializes VFS, streams to Claude with tools
3. Claude uses `str_replace_editor` or `file_manager` tools
4. Tool results sent back to Claude
5. onToolCall in ChatContext triggers FileSystemContext.handleToolCall
6. VFS updated, UI re-renders

### File System Operations
- All paths must start with `/` (root of VFS)
- Use `@/` import alias for local files (e.g., `import Counter from '@/components/Counter'`)
- VFS automatically creates parent directories as needed
- Files are never written to disk; everything stays in memory

### Preview Rendering
1. VFS files transformed by jsx-transformer
2. Import map created with blob URLs for each transformed file
3. HTML document generated with import map and entry point
4. Rendered in sandboxed iframe with Tailwind CSS CDN

## Testing

- Vitest with jsdom environment
- Tests in `__tests__` directories alongside source files
- Run individual test file: `npm test -- path/to/test.test.tsx`

## Environment Variables

```bash
ANTHROPIC_API_KEY=your-api-key-here  # Optional: enables Claude AI (falls back to mock provider)
```

## Important Notes

- `/App.jsx` is the required entry point for all projects
- No HTML files are created; App.jsx is the root component
- All imports use `@/` alias for VFS files
- Components are styled with Tailwind CSS (available via CDN in preview)
- The app works without an API key using a mock provider that generates static components
