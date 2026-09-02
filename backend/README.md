# Backend (NestJS)

API REST del workspace de tickets. Puerto **3001**.

## Como funciona (orden)

La pieza importante es **crear un ticket**. La IA no crea filas; las enriquece.

```
POST /tickets
  1. ValidationPipe valida el DTO (customerName, title, description, attachmentUrl opcional)
  2. TicketsService.savePendingTicket
       INSERT en PostgreSQL
       category = Unclassified, priority = Medium
       classificationStatus = PENDING
       El ticket YA existe aunque Groq falle
  3. AiService.classifyTicket
       a. Si no hay AI_API_KEY → FAILED
       b. Lee Category y Priority activas de la BD
       c. Llama a Groq (SDK OpenAI, base URL de Groq) pidiendo JSON estricto
       d. Comprueba que category/priority coincidan con el catalogo
  4. applyClassification
       SUCCESS → actualiza category, priority, summary
       FAILED  → deja Unclassified + Medium y guarda classificationError
  5. Respuesta con el ticket ya actualizado (incluye category, priority, owner, comments)
```

Despues el usuario puede cambiar estado, encargado, categoria, prioridad y summary con `PATCH`. Los comentarios son independientes de la IA.

**Por que Unclassified + Medium al crear:** valores del catalogo, seguros. Un fallo de Groq no debe parecer "Needed yesterday".

## Donde esta cada cosa

```
backend/
├── prisma/
│   ├── schema.prisma          Modelos y enums
│   ├── seed.ts                Usuarios + catalogos
│   └── migrations/            SQL aplicado a Postgres
├── prisma.config.ts           URL de BD (Prisma 7)
├── src/
│   ├── main.ts                CORS, ValidationPipe, puerto
│   ├── app.module.ts          Enchufa los modulos (si no esta aqui, la ruta no existe)
│   ├── prisma/                PrismaService (adapter pg)
│   ├── catalogs/catalog-names.ts
│   │                          Nombres fijos para el CODIGO (no es un endpoint)
│   ├── categories/            GET /categories
│   ├── priorities/            GET /priorities
│   ├── users/                 GET/POST /users
│   ├── tickets/               Tickets + comentarios anidados
│   ├── ai/                    Unica pieza que habla con Groq
│   └── generated/prisma/      Cliente generado. No editar. No se sube a git.
└── .env                       Local. No se sube a git.
```

`app.module.ts` es el tablero: un modulo que no se importa **no publica rutas**.

`catalog-names.ts` no lista datos para el frontend. Evita hardcodear `categoryId: 5`. El frontend usa `GET /categories` y `GET /priorities` (ves `name`, no solo ids).

`src/generated/` se recrea con `pnpm exec prisma generate`. Si lo borras, el API no compila.

## Endpoints

Base: `http://localhost:3001`

### Salud

| Metodo | Ruta | Que hace |
|--------|------|----------|
| GET | `/` | `{ "status": "ok" }` |
| GET | `/users/test` | Smoke test |
| GET | `/tickets/test` | Smoke test |

### Usuarios simulados (no hay login)

| Metodo | Ruta | Body |
|--------|------|------|
| GET | `/users` | — |
| POST | `/users` | `fullName`, `dateOfBirth` (ISO), `role`, `profession` |

Seed: Sarah Johnson, Michael Brown, Emily Davis, Daniel Martinez.

### Catalogos (solo lectura; sin CRUD)

| Metodo | Ruta | Que devuelve |
|--------|------|----------------|
| GET | `/categories` | Activas: Finance, Legal, Procurement, Operations, Unclassified |
| GET | `/priorities` | Activas: Needed yesterday, High, Medium, Low |

No existe `GET /catalog`.

### Tickets

| Metodo | Ruta | Body / notas |
|--------|------|----------------|
| GET | `/tickets` | Dashboard. Incluye category, priority, owner |
| GET | `/tickets/:id` | Detalle + comments ordenados |
| POST | `/tickets` | Solo datos de usuario. Luego corre la IA |
| PATCH | `/tickets/:id` | Campos opcionales de gestion y de IA |
| POST | `/tickets/:id/comments` | `{ "content", "authorName", "authorRole" }` |

**POST /tickets** (escribe el usuario):

```json
{
  "customerName": "ACME Corporation",
  "title": "Unpaid supplier invoice",
  "description": "We need to urgently review an invoice...",
  "attachmentUrl": "https://example.com/invoice.pdf"
}
```

`attachmentUrl` es opcional (URL, no subida de archivo).

**PATCH /tickets/:id** (todo opcional):

| Campo | Quien lo usa |
|-------|----------------|
| `status` | Gestion: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `ownerId` | Gestion: UUID de `GET /users` |
| `categoryId` | Corregir a la IA (entero del catalogo activo) |
| `priorityId` | Corregir a la IA |
| `summary` | Corregir a la IA |

No se puede PATCH de `title` / `description` / `customerName` en esta version.

Respuesta de clasificacion:

- `classificationStatus`: `PENDING` (breve, al insertar) → `SUCCESS` o `FAILED`
- `classificationError`: texto corto si fallo; `null` si ok
- Objetos anidados `category` y `priority` con `name` (el id solo no basta para la UI)

## IA (Groq)

Archivo: `src/ai/ai.service.ts`. `TicketsService` no arma el prompt.

Proveedor: Groq, SDK `openai`, `AI_BASE_URL=https://api.groq.com/openai/v1`. Modelo por defecto: `openai/gpt-oss-20b` (JSON schema estricto). Timeout 15 s. Si Groq falla, el POST **no** devuelve 500: el ticket queda en `FAILED`.

### Ordenes al modelo

**System:**

> You classify operational tickets. Use only the provided category and priority names. If the request does not fit Finance, Legal, Procurement or Operations, use Unclassified. Reply with JSON only.

**User:** lista de categorias y prioridades **con su `description` de la BD**, mas title y description del ticket.

**Formato forzado:** JSON con `category`, `priority`, `summary`. Los dos primeros son un `enum` con los `name` del catalogo; Groq no puede inventar "Billing" si no existe en la tabla.

El backend vuelve a validar: si el nombre no esta en PostgreSQL o el summary viene vacio → `FAILED`.

Variables: `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` (ver `.env.example` en la raiz). Nest carga `backend/.env` y el `.env` de la raiz.

## Modelo de datos (resumen)

Tres bloques en `Ticket`:

1. Usuario: `customerName`, `title`, `description`, `attachmentUrl`
2. IA (editable): `categoryId`, `priorityId`, `summary` + `classificationStatus` / `classificationError`
3. Gestion: `status`, `ownerId`, comentarios

`Category` y `Priority`: `id` entero, `name`, `description`, `active`. Sin `createdAt`/`updatedAt`.

## Comandos (carpeta `backend`)

```powershell
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm exec prisma db seed
pnpm run start:dev
```

Prisma 7 usa `prisma.config.ts` y el adapter `@prisma/adapter-pg`. No es el cliente clasico de Prisma 5.

En Docker el backend usa `DATABASE_URL` con host `postgres`. Al arrancar corre `prisma migrate deploy`, luego `prisma db seed`, y despues Nest.

## Deudas tecnicas (consciente)

- Sin CRUD de categorias/prioridades (`active` no se administra por API).
- Sin autenticacion (requisito del reto: usuarios simulados).
- Comentarios guardan nombre y rol como texto (no hay FK a User).
- Sin `PATCH` de title/description/customer.
- Sin boton "Retry classification" (se puede re-crear el ticket o esperar ese endpoint).

## Dependencias de runtime relevantes

NestJS 12 (ESM), Prisma 7.10, `openai`, `class-validator`, `@nestjs/config`. Gestor: pnpm. `pnpm-workspace.yaml` en `backend/` solo autoriza scripts de prisma/esbuild (pnpm 11).
