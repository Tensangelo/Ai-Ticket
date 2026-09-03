# Frontend (Next.js)

Interfaz del workspace de tickets. Puerto **3000**. Textos de la UI en ingles.

El arranque con Docker esta en el [README de la raiz](../README.md). Este archivo es para desarrollo local.

## Que hay aqui

- Dashboard (`/`): recuento por estado, tablero Kanban (Board) y lista (List). Badge si la IA fallo.
- Detalle (`/tickets/[id]`): solicitud, resumen de IA, comentarios, gestion (estado, encargado, categoria, prioridad, summary).
- **New ticket**: modal. El POST espera a Groq y luego abre el detalle.
- Identidad del operador: nombre y apellido en `localStorage`. Rol fijo: Head of Operations. Sirve para firmar comentarios. No hay login.

UI agrupada por feature: `src/components/layout`, `operator`, `tickets`. Las mutaciones de cliente (crear, PATCH, comentar) van en hooks; las paginas servidor siguen usando `src/lib/api`.

Next habla con Nest en `NEXT_PUBLIC_API_URL` (navegador) o `API_URL` (Server Components en Docker).

## Desarrollo

Si Compose ya tiene frontend y backend, no lances `pnpm dev` a la vez (choca el puerto 3000). En local deja solo Postgres:

```sh
docker compose up -d postgres
```

En esta carpeta:

```sh
cp ../.env.example .env.local
```

Deja `NEXT_PUBLIC_API_URL=http://localhost:3001`. Arranca Nest en `backend/` y luego:

```sh
pnpm install
pnpm dev
```

App: http://localhost:3000
