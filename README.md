# AI Ticket Workspace

Workspace ligero de tickets operativos impulsado por IA. Quien clone el repo solo necesita Docker y una clave de Groq.

La interfaz esta en ingles. Este README, [backend/README.md](backend/README.md) y [frontend/README.md](frontend/README.md) estan en espanol.

## Arquitectura

```
Navegador :3000 (Next.js)
    │  HTTP
    ▼
  NestJS :3001
    │
    ├── Prisma ──► PostgreSQL :5432 (servicio `postgres`)
    └── AiService ──► Groq (API compatible con OpenAI)
```

No hay login. El operador escribe nombre y apellido en el navegador (`localStorage`, rol fijo Head of Operations). Los encargados de tickets salen del seed (Sarah Johnson, Michael Brown, Emily Davis, Daniel Martinez).

## Requisitos

- Docker Desktop (Compose v2+)
- Clave gratuita de [Groq](https://console.groq.com) (sin tarjeta)
- Para desarrollo local: Node.js 24+ y pnpm 11+

## Arranque (Docker)

Desde la raiz del repo. Si Nest o Next ya corren en local, detenlos (puertos 3000 y 3001).

Copia `.env.example` a `.env` y pon `AI_API_KEY`. No subas `.env` a git. Sin esa clave los tickets se crean igual, pero la clasificacion queda `FAILED`.

```sh
cp .env.example .env
```

En PowerShell: `copy .env.example .env`

```sh
docker compose down -v
docker compose up --build
```

Espera a que el backend termine migrate + seed (el healthcheck da unos 40 s de margen). Luego:

| Que | URL |
|-----|-----|
| App | http://localhost:3000 |
| API | http://localhost:3001 (`GET /` → `{ "status": "ok" }`) |

Parar sin borrar datos: `docker compose down`  
Borrar tambien el volumen de Postgres: `docker compose down -v`

El navegador llama a Nest en `http://localhost:3001`. Los Server Components de Next, dentro de Docker, usan `http://backend:3001`. Compose inyecta `DATABASE_URL` del backend con host `postgres`, no `localhost`.

## Como usarlo

1. Abre http://localhost:3000 e indica nombre y apellido (se guarda en el navegador).
2. **New ticket**: cliente, titulo, descripcion y URL de adjunto opcional. El ticket se guarda primero; Groq clasifica despues.
3. El dashboard lista tickets. Si la IA falla veras el badge **AI failed** y el motivo.
4. El detalle (`/tickets/[id]`) permite cambiar estado, encargado, categoria, prioridad y resumen, y anadir comentarios firmados con tu nombre.

Asignacion automatica tras clasificar (no la elige Groq): Finance → Sarah Johnson, Legal → Michael Brown, Procurement → Daniel Martinez, Operations → Emily Davis. Unclassified o `FAILED` quedan sin encargado.

## Desarrollo local (solo Postgres en Docker)

```sh
docker compose up -d postgres
```

Backend, desde `backend/`:

```sh
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed
pnpm run start:dev
```

Frontend, desde `frontend/` (Next no lee el `.env` de la raiz):

```sh
cp .env.example .env.local
pnpm install
pnpm dev
```

En `.env.local` deja `NEXT_PUBLIC_API_URL=http://localhost:3001`. `DATABASE_URL` del `.env` de la raiz usa `localhost` porque Postgres publica el 5432.

Detalle de endpoints, prompts y Prisma: [backend/README.md](backend/README.md). Notas del UI: [frontend/README.md](frontend/README.md).

## Que hace la IA

Al `POST /tickets` el ticket **se guarda primero** (Unclassified + Medium + `PENDING`). Luego Groq propone `category`, `priority` y `summary`. El backend valida que esos nombres existan en el catalogo y asigna encargado segun la categoria. Si Groq falla, el ticket sigue existiendo con `FAILED` y un `classificationError`. Esos campos se pueden corregir con `PATCH`.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind
- Backend: NestJS 12, Prisma 7, PostgreSQL 16, Groq (`openai` SDK)
- Gestor de paquetes: pnpm
