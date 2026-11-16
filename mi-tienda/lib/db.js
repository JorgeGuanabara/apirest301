import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Solo activa SSL si pones DB_SSL=true en el .env
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 5,
});

// Lee las columnas reales de la tabla y decide cuáles se pueden editar.
export async function getColumnas(tabla, pk) {
  const [cols] = await pool.query(`SHOW COLUMNS FROM \`${tabla}\``);
  return cols.map((c) => ({
    name: c.Field,
    tipo: /int|decimal|float|double|numeric/i.test(c.Type) ? "number" : "text",
    nulo: c.Null === "YES",
    editable:
      c.Field !== pk &&
      !/date|time/i.test(c.Type) &&
      !/auto_increment|generated/i.test(c.Extra || ""),
  }));
}
