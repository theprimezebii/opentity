#!/bin/bash

OUTPUT_FILE="OPENTITY_HANDOFF.md"

echo "Generating Master Handoff Document..."

# 1. Write the Context Header
cat > "$OUTPUT_FILE" << 'HEADER'
# OPENTITY: Master Project Handoff & Context

## 1. PROJECT OVERVIEW
- **Name:** Opentity (Global aggregator for hackathons, tech competitions, and AI events).
- **Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Supabase (Auth, DB, Storage, RLS), Tailwind CSS v4, Lucide Icons, next-themes.
- **Monetization:** Sponsored event tags, and a future "Pro" tier.

## 2. ARCHITECTURE & CONFIG RULES (CRITICAL)
- **Next.js 16 Config:** `cacheComponents: true` is enabled. Do NOT use `export const revalidate`. Use `"use cache"` and `cacheLife("minutes")` instead.
- **Tailwind CSS v4:** Dark mode is enabled via `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`.
- **Middleware:** The file is named `src/proxy.ts` (not middleware.ts). It handles auth routing and `events_filters` cookie restoration.
- **Admin User:** `theprimezebii@gmail.com`.
- **Commands:** Always use `cat > file << 'EOF'` for new files/full overwrites, and `python3 << 'PYEOF'` for patches.

## 3. CURRENT STATE (COMPLETED)
- **Homepage:** Video hero, detailed skeletons, floating cards, animated categories, city explorer (auto-prioritizes user's country), SEO text.
- **Auth:** Sliding animation, floating cards, dark mode.
- **Events List:** Multi-select filters, Grid/List toggle, state preservation (cookies + proxy.ts), location prioritization (RPC), SEO dynamic meta, pagination.
- **Event Detail:** Cinematic hero, sticky sidebar (desktop), sticky bottom bar (mobile), missing data fallbacks, Add to Calendar, Share, Save.
- **Navbar/Footer:** Glassmorphism, huge logo, iOS-style theme toggle, mobile drawer with accordions, About page, Resources dropdown.
- **SEO:** `sitemap.ts`, `robots.ts`, `llms.txt`, JSON-LD schemas, Unsplash `remotePatterns`.

## 4. WHAT IS LEFT TO DO (NEXT PHASE)
The next AI should focus on:
1. **User Dashboard (`/dashboard`):** Audit and apply Dark Mode to Overview, Saved Events, Quests, Badges, Teams Hub, Leaderboard, Profile Settings.
2. **Admin Panel (`/admin`):** Audit events, submissions, users, homepage settings.
3. **Testing:** Test the Submit Event flow (requires login).

## 5. FULL SOURCE CODE

HEADER

# 2. Append all file contents
# Find all files in src, package.json, and config files
find src public/llms.txt package.json next.config.ts tailwind.config.ts -type f -not -path '*/node_modules/*' -not -path '*/.next/*' 2>/dev/null | sort | while read -r file; do
    
    # Determine language for syntax highlighting
    EXT="${file##*.}"
    LANG="typescript"
    if [ "$EXT" = "css" ]; then LANG="css"; fi
    if [ "$EXT" = "json" ]; then LANG="json"; fi
    if [ "$EXT" = "md" ]; then LANG="markdown"; fi

    # Append file block
    echo "" >> "$OUTPUT_FILE"
    echo "### File: \`$file\`" >> "$OUTPUT_FILE"
    echo "\`\`\`$LANG" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "End of Handoff. The codebase is fully attached above." >> "$OUTPUT_FILE"

echo "✅ Handoff generated successfully: $OUTPUT_FILE"
echo "You can now upload this file to a new AI chat."
