# Mi Tienda (Next.js + Tailwind + mysql2)

Usa la misma base MySQL de Railway del proyecto api-tienda.
Tablas: productos, categorias, usuarios, pedidos, estatuspedidos.

1. Edita `.env.local` con los datos de Railway (host y puerto PÚBLICOS).
2. `npm install`
3. `npm run dev` -> http://localhost:3000
4. Sube a GitHub y despliega en Vercel con las mismas variables DB_*.

Las columnas se leen solas de la base. Para agregar otra tabla, añádela en `lib/tablas.js`.
