# AI Ticket Workspace

Workspace ligero de tickets operativos impulsado por IA.

## Estado actual

Hoy `docker compose up` **solo** levanta Postgres. El API se arranca con pnpm en `backend/`. El evaluador pedira al final `docker compose up --build` con los tres servicios; eso se cierra cuando existan los Dockerfiles.

Detalle del API: [backend/README.md](backend/README.md).

## Arquitectura

```
Navegador (frontend)
    │  HTTP
    ▼
  NestJS :3001
    │
    ├── Prisma ──► PostgreSQL :5432 (contenedor Docker)
    └── AiService ──► Groq (API compatible con OpenAI)
```

No hay login. Los dueños de tickets son usuarios simulados (seed + `POST /users`).

## Requisitos locales

- Node.js 24+
- pnpm 11+
- Docker Desktop (Compose v2+)
- Clave gratuita de [Groq](https://console.groq.com) (sin tarjeta)

## Arranque (desarrollo)

### 1. Variables de entorno

```powershell
copy .env.example .env
```

En `.env.example` veras la estructura de las keys y dominios.

`DATABASE_URL` para Nest en tu PC usa `localhost` porque Postgres publica el puerto 5432. **Dentro de un contenedor** el host seria el nombre del servicio (`postgres`), no `localhost`.

### 2. Base de datos

Desde la raiz del repo (`d:\Projects\AI-ticket`):

```powershell
docker compose up -d
docker compose ps
```

Parar sin borrar datos: `docker compose down`
Borrar tambien el volumen: `docker compose down -v`

### 3. Backend

Desde `AI-ticket\backend`:

```powershell
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed
pnpm run start:dev
```

API: [http://localhost:3001](http://localhost:3001)
Health: `GET /` → `{ "status": "ok" }`

## Que hace la IA (resumen)

Al `POST /tickets` el ticket **se guarda primero** (Unclassified + Medium + `PENDING`). Luego Groq propone `category`, `priority` y `summary`. El backend valida que esos nombres existan en las tablas catalogo. Si Groq falla, el ticket sigue existiendo con `FAILED` y un `classificationError`. El usuario puede corregir esos campos con `PATCH`.

## Frontend (proximo)

Next.js 16, React 19, Tailwind, Zod. Puerto previsto **3000**. Hablara con `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3001`).

## Stack

- Frontend (previsto): Next.js 16, TypeScript, Tailwind, Zod
- Backend: NestJS 12, Prisma 7, PostgreSQL 16, Groq (`openai` SDK)
- Gestor de paquetes: pnpm

## Repositorio
