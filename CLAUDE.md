# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15 application using the App Router with React 19. The project implements a capital guessing game with Supabase authentication.

### Key Technologies
- **Next.js 15** with App Router and Turbopack for development
- **React 19** with TypeScript
- **Tailwind CSS** with custom design system using CSS variables
- **Supabase** for authentication and potential data storage
- **Radix UI** for accessible UI components (button, input, table)
- **Lucide React** for icons

### Application Structure
- **Main Game Component** (`src/app/page.tsx`): Capital guessing game with geographical distance calculations using Haversine formula
- **Authentication** (`src/app/login.tsx`, `src/utils/supabaseClient.ts`): Supabase-based auth system
- **UI Components** (`src/components/ui/`): Radix-based design system components
- **Data** (`src/data/`): JSON files containing world capitals and country information
- **Utilities** (`src/lib/utils.ts`): Tailwind class merging utilities

### Game Logic
The capital guessing game features:
- Random capital selection from comprehensive world capitals dataset
- Geographic distance calculation between user guesses and correct answers
- 5-guess limit with autocomplete suggestions
- Results table showing previous guesses and distances
- Hardcoded coordinate system for distance calculations

### Authentication System
Supabase integration with email/password authentication. Environment variables required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Styling Approach
Uses Tailwind CSS with a custom design system based on CSS variables for colors. The design system supports:
- Dark mode (configured but may not be fully implemented)
- Semantic color tokens (primary, secondary, destructive, etc.)
- Consistent spacing and typography

### Data Management
Game data is stored in JSON files rather than database:
- World capitals with coordinates in `world-capitals.json`
- Famous landmarks data in `famous-for.json`
- Coordinates are hardcoded in the main component for distance calculations