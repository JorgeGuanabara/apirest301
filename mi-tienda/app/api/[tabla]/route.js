import { NextResponse } from "next/server";
import { pool, getColumnas } from "@/lib/db";
import { TABLAS } from "@/lib/tablas";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { tabla } = await params;
  if (!Object.hasOwn(TABLAS, tabla)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 404 });
  }
  try {
    const columnas = await getColumnas(tabla, TABLAS[tabla].pk);
    const [filas] = await pool.query(`SELECT * FROM \`${tabla}\``);
    return NextResponse.json({ columnas, filas });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
