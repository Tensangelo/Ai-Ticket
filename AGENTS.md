# Agent notes (AI Ticket Workspace)

Human-facing docs are Spanish (`README.md`, `backend/README.md`, `frontend/README.md`). UI copy is English. Follow this file instead of inventing product scope.

## Stack and ports

- pnpm 11, Node 24
- `frontend/`: Next.js 16, React 19, Tailwind, port **3000**
- `backend/`: NestJS 12 (ESM), Prisma 7, port **3001**
- PostgreSQL 16 via Docker Compose (service `postgres`, port **5432**)
- LLM: Groq through the OpenAI SDK (`AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY`)

Do not add auth, JWT, Kubernetes, Redis, a monorepo, or category/priority CRUD.

## How to run

Evaluator / full stack: from the repo root, copy `.env.example` to `.env`, set `AI_API_KEY`, then `docker compose up --build`.

Daily development: only Postgres in Docker (`docker compose up -d postgres`). Nest: `pnpm run start:dev` in `backend/`. Next: `pnpm dev` in `frontend/` with `NEXT_PUBLIC_API_URL=http://localhost:3001` in `frontend/.env.local`. Next does not read the root `.env`.

Inside Compose, backend `DATABASE_URL` uses host `postgres`. On the host it uses `localhost`. Frontend browsers always call `http://localhost:3001`. Next Server Components in Docker use `API_URL=http://backend:3001`.

Never commit `.env`, `.env.local`, or secrets. Do not bake `AI_API_KEY` into Docker images.

## Product rules (do not reverse)

- Create ticket: user sends `customerName`, `title`, `description`, optional `attachmentUrl` (URL only).
- Persist first (Unclassified + Medium + `PENDING`), then classify. Groq must not block the insert. Failed classification → Unclassified + Medium + `FAILED` + `classificationError`. HTTP 200 still returns the ticket.
- Only `backend/src/ai/ai.service.ts` talks to Groq. `TicketsService` orchestrates save → classify → apply.
- Category/priority names must exist in the database catalogs. Do not hardcode catalog ids in business logic; use names in `catalog-names.ts`.
- Owner after SUCCESS comes from `category-assignees.ts` (Finance → Sarah Johnson, Legal → Michael Brown, Procurement → Daniel Martinez, Operations → Emily Davis). Unclassified or FAILED → no owner. Groq does not pick a person.
- Operator identity is first + last name in `localStorage`, role always Head of Operations. Used to sign comments. No user profile flow.
- PATCH may change status, owner, category, priority, summary. Not title, description, or customer.

## Code layout

- Nest: controllers stay thin; services own business rules and Prisma. A module that is not imported in `app.module.ts` has no routes.
- Prisma client is generated to `backend/src/generated/` (gitignored). Run `pnpm exec prisma generate` after schema changes.

## Frontend layout

UI is grouped by feature: `components/layout`, `components/operator`, `components/tickets`. API functions stay in `frontend/src/lib/api/`. Types stay in `frontend/src/lib/types/`. Icons stay in `frontend/src/assets/icons/`.

Server Components (pages) fetch via `lib/api` directly. Client mutations use hooks under `components/tickets/hooks` (and operator identity under `components/operator/hooks`). Do not call `fetch` inside presentational components.

### File names

- Use lower camelCase for frontend file names: `boardCard.tsx`, not `ticket-board-card.tsx`.
- Do not repeat the parent folder in the file name. A file inside `tickets/` is already a ticket file, so `detailView.tsx`, not `ticketDetailView.tsx`. Same for operator: `gate.tsx`, not `operatorGate.tsx`.

### Tickets folder

Only create and edit live at the first level of `components/tickets/`:

- `createTicket.tsx` — new-ticket modal
- `detailView.tsx` — ticket detail (read-only request, summary, comments list)

Everything else goes in a feature folder:

- `forms/` — add comment and manage ticket
- `dashboard/` — board, board card, table, status summary, dashboard toggle
- `status/` — status labels plus status / classification / priority badges
- `hooks/` — create ticket, update ticket, create comment

### Operator and layout

- `components/operator/`: `gate.tsx`, `badge.tsx`, `hooks/useIdentity.ts`
- `components/layout/`: `header.tsx`, `footer.tsx`
- Header and footer must have a compact layout on small viewports (short logo, initials-only badge, single-row footer).
- Ticket detail content sits slightly inset from the header/navbar (about 10–20px extra side padding) so it feels inside the shell, not flush with it.

### Forms vs read-only

- Read-only blocks use `.panel` or `.soft-panel`. Forms use `.form-panel` plus `.field` so inputs are visually distinct from plain text.
- Form action buttons use `.form-actions` (right-aligned). Do not put primary form actions on the left.

## Change style

- Small diffs. Match existing files instead of adding parallel abstractions.
- English identifiers and UI strings. Spanish only in README-style comments and docs.
- Ask before expanding scope (extra auth, new endpoints).
