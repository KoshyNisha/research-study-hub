# LabBridge — Claude Code Instructions

## Project Overview
LabBridge is a React frontend for a UMich hackathon project connecting 
undergraduates with research labs. Two-sided platform: students find 
labs, researchers find participants.

## Tech Stack
- React + Vite
- React Router v6
- Tailwind CSS (maize #FFCB05, blue #00274C as brand colors)
- Lucide React for icons
- No backend yet — all data from /src/data/ mock files

## Project Structure
/src
  /components
    /ui         — Button, Badge, Modal, Card, Toggle, Slider
    /layout     — Navbar, Sidebar, PageWrapper
    /lab        — LabCard, LabDetail, MatchScore, ApplyModal
    /dashboard  — ApplicationRow, StatusBadge, ProfileCompleteness
  /pages
    Landing.jsx
    Discover.jsx
    LabDetail.jsx
    Dashboard.jsx
  /data
    labs.js
    student.js
    applications.js
  App.jsx
  main.jsx

## Mock Data
- /src/data/student.js — Jane Doe profile (see schema in /docs/schema.json)
- /src/data/labs.js — 8-10 realistic UMich labs
- /src/data/applications.js — 3 apps in different statuses

## Design Rules
- Clean, minimal — think Linear/Notion not a university portal
- Generous whitespace, smooth hover transitions
- Match Score badge: gray <50%, blue 50-79%, maize 80%+
- LabCard hover: lift shadow + maize left border accent
- No lorem ipsum, no placeholder boxes — mock everything convincingly

## Pages
1. Landing (/) — hero, how it works, stats bar
2. Discover (/discover) — filter sidebar + lab match feed
3. Lab Detail (/lab/:id) — full profile + Apply Modal with auto-filled email
4. Dashboard (/dashboard) — application tracker + profile completeness card

## Key Behaviors
- Filter sidebar live-filters without page reload
- Apply Modal auto-populates email from student.js profile
- Dashboard status badges: Draft=gray, Sent=blue, Viewed=amber, Responded=green

## Current Status
[ ] App.jsx + routing
[ ] Mock data files
[ ] Landing page
[ ] Discover page
[ ] Lab Detail + Apply Modal
[ ] Dashboard
```

---

## The Exact Workflow

Once you're inside the project with `claude` running:

**Session 1 — scaffold everything:**
```
Build the full LabBridge frontend following CLAUDE.md. 
Start with App.jsx and routing, then mock data, 
then all four pages in order.
```

**Session 2 — wire the apply feature:**
```
Wire the Apply Modal in LabDetail.jsx to dynamically 
generate the email using the student profile from 
/src/data/student.js and the lab name/PI from labs.js
```

**Session 3 — polish:**
```
Review all four pages for visual consistency. 
Fix any missing hover states, empty states, 
and make sure Tailwind brand colors are applied correctly.