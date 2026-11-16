import { NextResponse } from "next/server";
import { pool, getColumnas } from "@/lib/db";
import { TABLAS } from "@/lib/tablas";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const { tabla, id } = await params;
  if (!Object.hasOwn(TABLAS, tabla)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 404 });
  }
  const t = TABLAS[tabla];
  try {
    const body = await req.json();
    const columnas = await getColumnas(tabla, t.pk);
    const cols = columnas.filter((c) => c.editable && c.name in body);
    if (cols.length === 0) {
      return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
    }
    const sets = cols.map((c) => `\`${c.name}\` = ?`).join(", ");
    const valores = cols.map((c) =>
      body[c.name] === "" && c.nulo ? null : body[c.name]
    );
    await pool.query(
      `UPDATE \`${tabla}\` SET ${sets} WHERE \`${t.pk}\` = ?`,
      [...valores, id]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { tabla, id } = await params;
  if (!Object.hasOwn(TABLAS, tabla)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 404 });
  }
  const t = TABLAS[tabla];
  try {
    await pool.query(`DELETE FROM \`${tabla}\` WHERE \`${t.pk}\` = ?`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg =
      e.code === "ER_ROW_IS_REFERENCED_2"
        ? "No se puede borrar: este registro está relacionado con otros registros"
        : e.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
