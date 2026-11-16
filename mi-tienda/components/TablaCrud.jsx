"use client";
import { useEffect, useState } from "react";
import { TABLAS } from "@/lib/tablas";

export default function TablaCrud({ tabla }) {
  const config = TABLAS[tabla];
  const [columnas, setColumnas] = useState([]);
  const [filas, setFilas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    try {
      const res = await fetch(`/api/${tabla}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setColumnas(data.columnas);
      setFilas(data.filas);
      setError("");
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabla]);

  function empezarEdicion(fila) {
    setEditId(fila[config.pk]);
    const valores = {};
    columnas
      .filter((c) => c.editable)
      .forEach((c) => (valores[c.name] = fila[c.name] ?? ""));
    setForm(valores);
  }

  async function guardar() {
    const res = await fetch(`/api/${tabla}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setEditId(null);
    setError("");
    cargar();
  }

  async function borrar(id) {
    if (!confirm("¿Seguro que deseas borrar este registro?")) return;
    const res = await fetch(`/api/${tabla}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setError("");
    cargar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{config.label}</h1>

      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}
      {cargando && <p className="text-gray-500">Cargando...</p>}

      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columnas.map((c) => (
                <th key={c.name} className="p-3">{c.name}</th>
              ))}
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => {
              const id = fila[config.pk];
              const editando = editId === id;
              return (
                <tr key={id} className="border-t">
                  {columnas.map((c) => (
                    <td key={c.name} className="p-3">
                      {editando && c.editable ? (
                        <input
                          type={c.tipo}
                          step={c.tipo === "number" ? "any" : undefined}
                          value={form[c.name] ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, [c.name]: e.target.value })
                          }
                          className="w-full min-w-24 rounded border px-2 py-1"
                        />
                      ) : (
                        String(fila[c.name] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="p-3 whitespace-nowrap">
                    {editando ? (
                      <>
                        <button onClick={guardar} className="mr-2 rounded bg-green-600 px-3 py-1 text-white">
                          Guardar
                        </button>
                        <button onClick={() => setEditId(null)} className="rounded bg-gray-400 px-3 py-1 text-white">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => empezarEdicion(fila)} className="mr-2 rounded bg-blue-600 px-3 py-1 text-white">
                          Modificar
                        </button>
                        <button onClick={() => borrar(id)} className="rounded bg-red-600 px-3 py-1 text-white">
                          Borrar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {!cargando && filas.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 1} className="p-4 text-center text-gray-500">
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
