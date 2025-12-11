---
description: Repository Information Overview
alwaysApply: true
---

# HireBot AI App Lite Information

## Summary

HireBot AI App Lite is a streamlined technical assessment platform for evaluating candidates' programming skills. Built with Next.js 15.3.2 and React 19, it enables recruiters to create customized assessments, manage candidates, and evaluate technical knowledge efficiently. The application features a comprehensive candidate management system, customizable technical assessments, multiple question types with code evaluation, automated scoring, and a responsive, accessible interface.

## Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable UI components (auth, common, layout, question, ui)
├── config/                 # Configuration files
├── contexts/               # React context providers
├── helpers/                # Helper functions
├── hooks/                  # Custom React hooks
├── libs/                   # Library configurations (axios)
├── middlewares/            # Next.js middleware
├── pages/                  # API routes
├── services/               # API service functions
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Language & Runtime

**Language**: TypeScript 5.8.3  
**Runtime**: Node.js (via Bun 1.1)  
**Framework**: Next.js 15.3.2  
**UI Library**: React 19.1.0  
**Build System**: Next.js with Turbopack  
**Package Manager**: Bun

## Dependencies

**Main Dependencies**:
- React 19.1.0, React DOM 19.1.0
- Next.js 15.3.2
- Radix UI (avatar, checkbox, dialog, dropdown, label, navigation, popover, select, switch, tooltip)
- TanStack React Query 5.76.1 with DevTools
- Tailwind CSS 4.1.7
- React Hook Form 7.56.4
- Zod 3.24.4 (schema validation)
- Axios 1.9.0
- React Markdown 10.1.0
- React Syntax Highlighter 15.6.1
- Lucide React 0.510.0 (icons)

**Development Dependencies**:
- Jest 29.7.0 with jest-environment-jsdom
- Testing Library (React, User Event, Jest DOM)
- ESLint 9.27.0 with next config
- Prettier 3.5.3
- TypeScript 5.8.3

## Build & Installation

```bash
# Install dependencies
bun install

# Development server
bun dev

# Production build
bun run build

# Start production server
bun run start

# Linting
bun lint

# Code formatting
bun format
```

## Docker

**Dockerfile**: Uses Bun 1.1 slim image  
**Base Image**: `oven/bun:1.1-slim`  
**Working Directory**: `/app`  
**Environment**: `NODE_ENV=development`  
**Port**: 3000 (exposed)  
**Command**: `bun dev`

**Docker Compose**: Includes:
- App service (Bun development environment)
- Nginx service (reverse proxy on configurable port, default 8008)
- Shared network: `dev_tools`

## Testing

**Framework**: Jest with Bun test runner  
**Test Location**: `src/**/__tests__/` directories  
**Naming Convention**: `*.test.ts` or `*.test.tsx`  
**Configuration**: `jest.config.js` with:
  - Module path mapping for `@/*` alias
  - DOM environment using Bun's built-in DOM implementation
  - Preloaded setup file (`jest.setup.js`)

**Test Files Found**:
- `src/contexts/__tests__/LoadingContext.test.tsx`
- `src/components/common/__tests__/LoadingComponent.test.tsx`

**Run Commands**:
```bash
# Run tests once
bun test

# Watch mode
bun test --watch
```

## Configuration Files

**Main Entry Point**: `src/app/layout.tsx` (Next.js App Router)  
**TypeScript Config**: `tsconfig.json` with path alias `@/*` → `src/*`  
**Next.js Config**: `next.config.ts`  
**Tailwind Config**: `tailwind.config.js`  
**ESLint Config**: `eslint.config.mjs`  
**Prettier Config**: `.prettierrc`  
**PostCSS Config**: `postcss.config.mjs`

**Environment Variables** (see `.env.example`):
- `NEXT_PUBLIC_API_BASE_URL`: API endpoint
- `NEXT_PUBLIC_AUTH_CLIENT_ID/SECRET`: Authentication credentials
- `NODE_ENV`: Environment mode
- `NEXT_PUBLIC_MIN_LOADING_TIME`: UI loading duration
