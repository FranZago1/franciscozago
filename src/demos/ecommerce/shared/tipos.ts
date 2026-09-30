/** Lo mínimo que el carrito y el checkout necesitan saber de un producto. */
export type ProductoCarrito = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  alt: string;
  /** Línea secundaria en el carrito (color, tamaño, marca). */
  detalle?: string;
};

export type OpcionEnvio = {
  id: string;
  nombre: string;
  /** Texto de plazo; `{fecha}` se reemplaza por la fecha estimada. */
  detalle: string;
  dias: number;
  precio: number;
  /** Si es true, el envío se bonifica al superar `envioGratisDesde`. */
  bonificable?: boolean;
  /** Retiro en local: no pide dirección. */
  retiro?: boolean;
};

export type ConfigTienda = {
  nombre: string;
  envioGratisDesde: number;
  cuotasSinInteres: number;
  envios: OpcionEnvio[];
  prefijoPedido: string;
  /** Etiqueta de la variante en el carrito ("Talle", "Tamaño"). */
  etiquetaVariante?: string;
  /** Dirección del local para retiro. */
  local: string;
};

/** Clases por demo para que carrito y checkout tomen la identidad de cada tienda. */
export type TemaTienda = {
  panel: string;
  overlay: string;
  titulo: string;
  borde: string;
  suave: string;
  superficie: string;
  boton: string;
  botonSec: string;
  botonIcono: string;
  input: string;
  label: string;
  error: string;
  opcion: string;
  opcionOn: string;
  barra: string;
  pista: string;
  imagen: string;
  acento: string;
  toast: string;
  paso: string;
  /** Contenedor del selector de cantidad. */
  control: string;
  pasoOn: string;
};
