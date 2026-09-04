#!/usr/bin/env bash
set -e
echo "=== Frontend setup (Next.js like genlayer-jury) ==="
if [ ! -f "frontend/package.json" ]; then
  echo "Bootstrapping frontend from genlayer-jury pattern..."
  mkdir -p frontend
  cp -r /home/unify/genlayer-jury/package.json frontend/ 2>/dev/null || cat > frontend/package.json << 'PKG'
{
  "name": "provedown-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "genlayer-js": "^1.1.8",
    "motion": "^12.38.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
PKG
  echo "Frontend package.json created (re-run npm install)"
fi
echo "Installing..."
npm --prefix frontend install 2>&1 | tail -n 5 || echo "npm install failed — check Node 20.9+ required for Next 16"
echo "Building..."
npm --prefix frontend run build 2>&1 | tail -n 20 || echo "build may fail before .env.local set — expected"
echo "Next: set .env.local per .env.example, then npm --prefix frontend run dev (http://localhost:3000)"
