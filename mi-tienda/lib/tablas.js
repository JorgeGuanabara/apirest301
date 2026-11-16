// Solo defines el nombre de la tabla, su etiqueta del menú y su llave primaria.
// Las columnas se leen automáticamente de la base de datos.
export const TABLAS = {
  productos: { label: "Productos", pk: "id_producto" },
  categorias: { label: "Categorías", pk: "id_categoria" },
  usuarios: { label: "Usuarios", pk: "id_usuario" },
  pedidos: { label: "Pedidos", pk: "id_pedido" },
  estatuspedidos: { label: "Estatus de pedidos", pk: "id_estatus" },
};
