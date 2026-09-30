"use client";

import Image from "next/image";
import { Dialogo } from "./Dialogo";
import { pesos, cuota } from "./formato";
import { IconoBasura, IconoBolsa, IconoCerrar, IconoMas, IconoMenos } from "./Iconos";
import { unidades, type Tienda } from "./tienda";
import type { ConfigTienda, ProductoCarrito, TemaTienda } from "./tipos";

export function CarritoDrawer({
  tienda,
  productos,
  tema,
  config,
  trazo = 1.75,
}: {
  tienda: Tienda;
  productos: Record<string, ProductoCarrito>;
  tema: TemaTienda;
  config: ConfigTienda;
  trazo?: number;
}) {
  const abierto = tienda.useTienda((e) => e.capa === "carrito");
  const lineas = tienda.useTienda((e) => e.lineas);
  const total = tienda.useTienda(unidades);
  const subtotal = lineas.reduce((s, l) => s + (productos[l.id]?.precio ?? 0) * l.cantidad, 0);
  const falta = Math.max(0, config.envioGratisDesde - subtotal);
  const progreso = Math.min(100, (subtotal / config.envioGratisDesde) * 100);
  const cerrar = () => tienda.abrir(null);

  return (
    <Dialogo abierto={abierto} onCerrar={cerrar} titulo="carrito-titulo" variante="derecha" className={`flex flex-col ${tema.panel}`} overlayClassName={tema.overlay}>
      <div className={`flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6 ${tema.borde}`}>
        <h2 id="carrito-titulo" className={tema.titulo}>
          Tu carrito <span className={tema.suave}>({total})</span>
        </h2>
        <button type="button" onClick={cerrar} className={tema.botonIcono} aria-label="Cerrar carrito">
          <IconoCerrar trazo={trazo} />
        </button>
      </div>

      {lineas.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
          <span className={`grid size-16 place-items-center rounded-full ${tema.superficie}`}>
            <IconoBolsa className="size-7" trazo={trazo} />
          </span>
          <p className="text-lg">Tu carrito está vacío.</p>
          <p className={`max-w-[26ch] text-sm ${tema.suave}`}>Mirá el catálogo y sumá lo que te guste: acá lo vas a ver con el total.</p>
          <button type="button" onClick={cerrar} className={`mt-2 ${tema.botonSec}`} data-autofocus>
            Seguir comprando
          </button>
        </div>
      ) : (
        <>
          <div className={`border-b px-5 py-4 sm:px-6 ${tema.borde}`}>
            <p className="text-sm" aria-live="polite">
              {falta > 0 ? (
                <>
                  Te faltan <strong>{pesos(falta)}</strong> para el envío gratis.
                </>
              ) : (
                <strong>Tenés envío gratis a domicilio.</strong>
              )}
            </p>
            <div className={`mt-2.5 h-1.5 overflow-hidden rounded-full ${tema.pista}`} aria-hidden="true">
              <div className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${tema.barra}`} style={{ width: `${progreso}%` }} />
            </div>
          </div>

          <ul className="flex-1 divide-y px-5 sm:px-6" aria-label="Productos en el carrito">
            {lineas.map((l) => {
              const p = productos[l.id];
              if (!p) return null;
              return (
                <li key={l.clave} className={`flex gap-4 py-5 ${tema.borde}`}>
                  <div className={`relative h-[104px] w-[84px] shrink-0 overflow-hidden ${tema.imagen}`}>
                    <Image src={p.imagen} alt={p.alt} fill sizes="84px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{p.nombre}</p>
                        <p className={`mt-0.5 text-sm ${tema.suave}`}>
                          {[p.detalle, l.variante ? `${config.etiquetaVariante ?? "Variante"}: ${l.variante}` : null].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p className="shrink-0 font-medium tabular-nums">{pesos(p.precio * l.cantidad)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className={`inline-flex items-center border ${tema.borde} ${tema.control}`} role="group" aria-label={`Cantidad de ${p.nombre}`}>
                        <button
                          type="button"
                          className="grid size-9 place-items-center disabled:opacity-40"
                          onClick={() => tienda.cambiarCantidad(l.clave, l.cantidad - 1)}
                          aria-label={l.cantidad === 1 ? `Quitar ${p.nombre}` : `Restar una unidad de ${p.nombre}`}
                        >
                          <IconoMenos className="size-4" trazo={trazo} />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
                          {l.cantidad}
                        </span>
                        <button
                          type="button"
                          className="grid size-9 place-items-center disabled:opacity-40"
                          onClick={() => tienda.cambiarCantidad(l.clave, l.cantidad + 1)}
                          disabled={l.cantidad >= tienda.maxCantidad}
                          aria-label={`Sumar una unidad de ${p.nombre}`}
                        >
                          <IconoMas className="size-4" trazo={trazo} />
                        </button>
                      </div>
                      <button type="button" onClick={() => tienda.quitar(l.clave, p.nombre)} className={`inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline ${tema.suave}`}>
                        <IconoBasura className="size-4" trazo={trazo} />
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={`sticky bottom-0 border-t px-5 pt-4 pb-5 sm:px-6 ${tema.borde} ${tema.panel}`}>
            <div className="flex items-baseline justify-between">
              <span>Subtotal</span>
              <span className="text-xl font-semibold tabular-nums">{pesos(subtotal)}</span>
            </div>
            <p className={`mt-1 text-sm ${tema.suave}`}>
              {config.cuotasSinInteres} cuotas sin interés de {pesos(cuota(subtotal, config.cuotasSinInteres))}. El envío se calcula en el siguiente paso.
            </p>
            <button type="button" className={`mt-4 w-full ${tema.boton}`} onClick={() => tienda.abrir("checkout")}>
              Iniciar compra
            </button>
            <button type="button" className={`mt-2 w-full py-2 text-sm underline-offset-4 hover:underline ${tema.suave}`} onClick={cerrar}>
              Seguir comprando
            </button>
          </div>
        </>
      )}
    </Dialogo>
  );
}
