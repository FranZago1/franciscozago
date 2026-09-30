"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Dialogo } from "./Dialogo";
import { cuota, fechaHabil, pesos, PROVINCIAS } from "./formato";
import { IconoCandado, IconoCerrar, IconoCheck, IconoLocal, IconoCamion, IconoTarjeta, IconoVolver, IconoRayo } from "./Iconos";
import type { Linea, Tienda } from "./tienda";
import type { ConfigTienda, ProductoCarrito, TemaTienda } from "./tipos";

type Datos = {
  email: string;
  nombre: string;
  telefono: string;
  dni: string;
  envio: string;
  calle: string;
  depto: string;
  cp: string;
  ciudad: string;
  provincia: string;
  medio: "credito" | "debito" | "dinero";
  cuotas: number;
};

type Errores = Partial<Record<keyof Datos, string>>;
type Paso = 1 | 2 | 3;
type Estado = "form" | "procesando" | "listo";

const PASOS = ["Tus datos", "Envío", "Pago"] as const;

function validar(paso: Paso, d: Datos, requiereDireccion: boolean): Errores {
  const e: Errores = {};
  if (paso === 1) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Ingresá un email válido, por ejemplo nombre@correo.com.";
    if (d.nombre.trim().split(/\s+/).length < 2) e.nombre = "Escribí tu nombre y apellido.";
    if (d.telefono.replace(/\D/g, "").length < 8) e.telefono = "El teléfono tiene que tener al menos 8 números.";
    if (!/^\d{7,8}$/.test(d.dni.replace(/\./g, ""))) e.dni = "El DNI tiene 7 u 8 números, sin puntos.";
  }
  if (paso === 2) {
    if (!d.envio) e.envio = "Elegí cómo querés recibir tu pedido.";
    if (requiereDireccion) {
      if (d.calle.trim().length < 4 || !/\d/.test(d.calle)) e.calle = "Escribí la calle y el número.";
      if (!/^([A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/.test(d.cp.trim())) e.cp = "El código postal tiene 4 números (ej. 5000).";
      if (d.ciudad.trim().length < 2) e.ciudad = "Escribí tu ciudad.";
      if (!d.provincia) e.provincia = "Elegí una provincia.";
    }
  }
  return e;
}

export function Checkout(props: {
  tienda: Tienda;
  productos: Record<string, ProductoCarrito>;
  tema: TemaTienda;
  config: ConfigTienda;
  trazo?: number;
}) {
  const abierto = props.tienda.useTienda((e) => e.capa === "checkout");
  return (
    <Dialogo
      abierto={abierto}
      onCerrar={() => props.tienda.abrir(null)}
      titulo="checkout-titulo"
      variante="pantalla"
      className={`md:max-w-5xl ${props.tema.panel}`}
      overlayClassName={props.tema.overlay}
    >
      <CheckoutContenido {...props} />
    </Dialogo>
  );
}

function CheckoutContenido({
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
  const lineasVivas = tienda.useTienda((e) => e.lineas);
  const [paso, setPaso] = useState<Paso>(1);
  const [estado, setEstado] = useState<Estado>("form");
  const [pedido, setPedido] = useState<{ numero: string; lineas: Linea[] } | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [d, setD] = useState<Datos>({
    email: "",
    nombre: "",
    telefono: "",
    dni: "",
    envio: config.envios[0]?.id ?? "",
    calle: "",
    depto: "",
    cp: "",
    ciudad: "",
    provincia: "",
    medio: "credito",
    cuotas: config.cuotasSinInteres,
  });
  const form = useRef<HTMLFormElement>(null);
  const uid = useId();

  const lineas = pedido?.lineas ?? lineasVivas;
  const subtotal = lineas.reduce((s, l) => s + (productos[l.id]?.precio ?? 0) * l.cantidad, 0);
  const envio = config.envios.find((e) => e.id === d.envio);
  const envioGratis = envio?.bonificable && subtotal >= config.envioGratisDesde;
  const costoEnvio = envio ? (envioGratis ? 0 : envio.precio) : 0;
  const total = subtotal + (paso >= 2 || pedido ? costoEnvio : 0);
  const requiereDireccion = !envio?.retiro;
  const cerrar = () => tienda.abrir(null);

  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    if (errores[k]) setErrores((prev) => ({ ...prev, [k]: undefined }));
  };

  function enfocarPrimerError(e: Errores) {
    const primero = Object.keys(e)[0];
    if (!primero) return;
    requestAnimationFrame(() => {
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
    });
  }

  function continuar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar(paso, d, requiereDireccion);
    setErrores(e);
    if (Object.keys(e).length) {
      enfocarPrimerError(e);
      return;
    }
    if (paso < 3) {
      setPaso((paso + 1) as Paso);
      requestAnimationFrame(() => document.getElementById(`${uid}-paso`)?.focus());
      return;
    }
    // Pago simulado: no se envía nada a ningún servidor.
    setEstado("procesando");
    const numero = `${config.prefijoPedido}-${Math.floor(10000 + Math.random() * 89999)}`;
    const snapshot = lineasVivas;
    window.setTimeout(() => {
      setPedido({ numero, lineas: snapshot });
      setEstado("listo");
      tienda.vaciar();
      requestAnimationFrame(() => document.getElementById(`${uid}-listo`)?.focus());
    }, 1800);
  }

  const campo = (k: keyof Datos, label: string, opts: { tipo?: string; auto?: string; ayuda?: string; modo?: "numeric" | "email" | "tel" | "text"; className?: string } = {}) => {
    const idc = `${uid}-${k}`;
    const err = errores[k];
    return (
      <div className={opts.className}>
        <label htmlFor={idc} className={tema.label}>
          {label}
        </label>
        <input
          id={idc}
          name={k}
          type={opts.tipo ?? "text"}
          inputMode={opts.modo}
          autoComplete={opts.auto}
          value={String(d[k])}
          onChange={(e) => set(k, e.target.value as never)}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${idc}-err` : opts.ayuda ? `${idc}-ayuda` : undefined}
          className={`mt-1.5 w-full ${tema.input}`}
        />
        {err ? (
          <p id={`${idc}-err`} className={`mt-1.5 text-sm ${tema.error}`}>
            {err}
          </p>
        ) : opts.ayuda ? (
          <p id={`${idc}-ayuda`} className={`mt-1.5 text-sm ${tema.suave}`}>
            {opts.ayuda}
          </p>
        ) : null}
      </div>
    );
  };

  const resumen = (
    <aside aria-label="Resumen del pedido" className={`p-5 sm:p-6 md:p-8 ${tema.superficie}`}>
      <h3 className="text-sm font-semibold tracking-wide uppercase">Tu pedido</h3>
      <ul className="mt-4 space-y-4">
        {lineas.map((l) => {
          const p = productos[l.id];
          if (!p) return null;
          return (
            <li key={l.clave} className="flex items-center gap-3">
              <div className={`relative size-14 shrink-0 overflow-hidden ${tema.imagen}`}>
                <Image src={p.imagen} alt={p.alt} fill sizes="56px" className="object-cover" />
                <span className="absolute top-0.5 right-0.5 grid min-w-5 place-items-center rounded-full bg-black/75 px-1 text-[11px] font-semibold text-white">{l.cantidad}</span>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium">{p.nombre}</p>
                {l.variante ? (
                  <p className={tema.suave}>
                    {config.etiquetaVariante ?? "Variante"}: {l.variante}
                  </p>
                ) : null}
              </div>
              <p className="text-sm tabular-nums">{pesos(p.precio * l.cantidad)}</p>
            </li>
          );
        })}
      </ul>
      <dl className={`mt-5 space-y-2 border-t pt-4 text-sm ${tema.borde}`}>
        <div className="flex justify-between">
          <dt className={tema.suave}>Subtotal</dt>
          <dd className="tabular-nums">{pesos(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className={tema.suave}>Envío</dt>
          <dd className="tabular-nums">{paso === 1 && !pedido ? "Se calcula después" : costoEnvio === 0 ? "Gratis" : pesos(costoEnvio)}</dd>
        </div>
        <div className={`flex items-baseline justify-between border-t pt-3 text-base ${tema.borde}`}>
          <dt className="font-semibold">Total</dt>
          <dd className="text-xl font-semibold tabular-nums">{pesos(total)}</dd>
        </div>
        <p className={`text-xs ${tema.suave}`}>
          O {config.cuotasSinInteres} cuotas sin interés de {pesos(cuota(total, config.cuotasSinInteres))}
        </p>
      </dl>
    </aside>
  );

  if (estado === "listo" && pedido) {
    const direccion = envio?.retiro ? `Retiro en ${config.local}` : `${d.calle}${d.depto ? `, ${d.depto}` : ""}, ${d.ciudad} (${d.cp}), ${d.provincia}`;
    return (
      <div className="md:grid md:grid-cols-[1fr_380px]">
        <div className="relative p-6 pb-10 sm:p-10">
          <button type="button" onClick={cerrar} className={`absolute top-4 right-4 ${tema.botonIcono}`} aria-label="Cerrar">
            <IconoCerrar trazo={trazo} />
          </button>
          <span className={`grid size-14 place-items-center rounded-full ${tema.barra}`}>
            <IconoCheck className="size-7" trazo={2.2} />
          </span>
          <h2 id="checkout-titulo" className={`mt-6 ${tema.titulo}`}>
            <span id={`${uid}-listo`} tabIndex={-1} className="outline-none">
              ¡Listo, {d.nombre.trim().split(/\s+/)[0]}! Tu pedido está confirmado.
            </span>
          </h2>
          <p className={`mt-3 ${tema.suave}`}>
            Pedido <strong className="font-mono">{pedido.numero}</strong> · Te mandaríamos la confirmación a {d.email}.
          </p>
          <dl className={`mt-8 grid gap-5 border-t pt-6 text-sm sm:grid-cols-2 ${tema.borde}`}>
            <div>
              <dt className={tema.suave}>Entrega</dt>
              <dd className="mt-1 font-medium">{envio?.nombre}</dd>
              <dd className="mt-0.5">{direccion}</dd>
              {envio ? <dd className={`mt-0.5 ${tema.suave}`}>{envio.detalle.replace("{fecha}", fechaHabil(envio.dias))}</dd> : null}
            </div>
            <div>
              <dt className={tema.suave}>Pago</dt>
              <dd className="mt-1 font-medium">Mercado Pago (simulado)</dd>
              <dd className="mt-0.5">
                {d.medio === "credito" ? `Tarjeta de crédito en ${d.cuotas} ${d.cuotas === 1 ? "pago" : "cuotas sin interés"}` : d.medio === "debito" ? "Tarjeta de débito" : "Dinero en cuenta"}
              </dd>
            </div>
          </dl>
          <div role="note" className={`mt-8 flex gap-3 border p-4 text-sm ${tema.borde}`}>
            <IconoCandado className="mt-0.5 size-5 shrink-0" trazo={trazo} />
            <p>
              <strong>Esto es una demo.</strong> No se cobró nada, no se guardó ni se envió ningún dato y el pedido no existe. En una tienda real, este paso
              te lleva al checkout de Mercado Pago y el pedido te llega por mail y al panel de ventas.
            </p>
          </div>
          <button type="button" className={`mt-8 ${tema.boton}`} onClick={cerrar}>
            Volver a la tienda
          </button>
        </div>
        <div className={`md:border-l ${tema.borde} ${tema.superficie}`}>{resumen}</div>
      </div>
    );
  }

  return (
    <div className="md:grid md:grid-cols-[1fr_380px]">
      <div className="p-5 pb-10 sm:p-8 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <h2 id="checkout-titulo" className={tema.titulo}>
            Finalizar compra
          </h2>
          <button type="button" onClick={cerrar} className={tema.botonIcono} aria-label="Cerrar checkout">
            <IconoCerrar trazo={trazo} />
          </button>
        </div>

        <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Pasos de la compra">
          {PASOS.map((nombre, i) => {
            const n = (i + 1) as Paso;
            const actual = n === paso;
            const hecho = n < paso;
            return (
              <li key={nombre} aria-current={actual ? "step" : undefined} className={`${tema.paso} ${actual || hecho ? tema.pasoOn : ""}`}>
                <span className="font-mono text-xs opacity-70">0{n}</span>
                <span className="block truncate">{nombre}</span>
              </li>
            );
          })}
        </ol>

        <form ref={form} onSubmit={continuar} noValidate className="mt-8">
          <h3 id={`${uid}-paso`} tabIndex={-1} className="text-lg font-semibold outline-none">
            {paso === 1 ? "¿A quién le enviamos el pedido?" : paso === 2 ? "¿Cómo lo querés recibir?" : "Pagá con Mercado Pago"}
          </h3>

          {paso === 1 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {campo("email", "Email", { tipo: "email", auto: "email", modo: "email", className: "sm:col-span-2", ayuda: "Te mandamos el seguimiento del pedido acá." })}
              {campo("nombre", "Nombre y apellido", { auto: "name", className: "sm:col-span-2" })}
              {campo("telefono", "Teléfono", { tipo: "tel", auto: "tel", modo: "tel" })}
              {campo("dni", "DNI", { modo: "numeric", ayuda: "Lo pide la factura." })}
            </div>
          ) : null}

          {paso === 2 ? (
            <>
              <fieldset className="mt-5">
                <legend className="sr-only">Forma de entrega</legend>
                <div className="grid gap-3">
                  {config.envios.map((op) => {
                    const on = d.envio === op.id;
                    const gratis = op.bonificable && subtotal >= config.envioGratisDesde;
                    const Icono = op.retiro ? IconoLocal : op.dias <= 1 ? IconoRayo : IconoCamion;
                    return (
                      <label key={op.id} className={`flex cursor-pointer items-center gap-4 ${tema.opcion} ${on ? tema.opcionOn : ""}`}>
                        <input type="radio" name="envio" value={op.id} checked={on} onChange={() => set("envio", op.id)} className="size-4 shrink-0 accent-current" />
                        <Icono className="size-6 shrink-0" trazo={trazo} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{op.nombre}</span>
                          <span className={`block text-sm ${tema.suave}`}>{op.retiro ? `${config.local}. ` : ""}{op.detalle.replace("{fecha}", fechaHabil(op.dias))}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">{op.precio === 0 || gratis ? "Gratis" : pesos(op.precio)}</span>
                      </label>
                    );
                  })}
                </div>
                {errores.envio ? <p className={`mt-2 text-sm ${tema.error}`}>{errores.envio}</p> : null}
              </fieldset>
              {requiereDireccion ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-6">
                  {campo("calle", "Calle y número", { auto: "address-line1", className: "sm:col-span-4" })}
                  {campo("depto", "Piso / depto (opcional)", { auto: "address-line2", className: "sm:col-span-2" })}
                  {campo("cp", "Código postal", { auto: "postal-code", modo: "numeric", className: "sm:col-span-2" })}
                  {campo("ciudad", "Ciudad", { auto: "address-level2", className: "sm:col-span-4" })}
                  <div className="sm:col-span-6">
                    <label htmlFor={`${uid}-provincia`} className={tema.label}>
                      Provincia
                    </label>
                    <select
                      id={`${uid}-provincia`}
                      name="provincia"
                      value={d.provincia}
                      onChange={(e) => set("provincia", e.target.value)}
                      aria-invalid={errores.provincia ? true : undefined}
                      aria-describedby={errores.provincia ? `${uid}-provincia-err` : undefined}
                      className={`mt-1.5 w-full ${tema.input}`}
                    >
                      <option value="">Elegí una provincia</option>
                      {PROVINCIAS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    {errores.provincia ? (
                      <p id={`${uid}-provincia-err`} className={`mt-1.5 text-sm ${tema.error}`}>
                        {errores.provincia}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {paso === 3 ? (
            <div className="mt-5">
              <div className={`flex items-center gap-3 border p-4 ${tema.borde}`}>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00A0E3] text-white" aria-hidden="true">
                  <IconoTarjeta className="size-5" trazo={2} />
                </span>
                <p className="text-sm">
                  <strong className="block">Mercado Pago · pago simulado</strong>
                  <span className={tema.suave}>En la tienda real se abre el checkout seguro de Mercado Pago. Acá no se pide ningún dato de tarjeta.</span>
                </p>
              </div>
              <fieldset className="mt-5">
                <legend className={tema.label}>Medio de pago</legend>
                <div className="mt-2 grid gap-3">
                  {(
                    [
                      ["credito", "Tarjeta de crédito", `Hasta ${config.cuotasSinInteres} cuotas sin interés`],
                      ["debito", "Tarjeta de débito", "Se acredita en el momento"],
                      ["dinero", "Dinero en cuenta de Mercado Pago", "Pagás con tu saldo disponible"],
                    ] as const
                  ).map(([id, nombre, detalle]) => (
                    <label key={id} className={`flex cursor-pointer items-center gap-4 ${tema.opcion} ${d.medio === id ? tema.opcionOn : ""}`}>
                      <input type="radio" name="medio" value={id} checked={d.medio === id} onChange={() => set("medio", id)} className="size-4 shrink-0 accent-current" />
                      <span>
                        <span className="block font-medium">{nombre}</span>
                        <span className={`block text-sm ${tema.suave}`}>{detalle}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {d.medio === "credito" ? (
                <div className="mt-5">
                  <label htmlFor={`${uid}-cuotas`} className={tema.label}>
                    Cuotas
                  </label>
                  <select id={`${uid}-cuotas`} value={d.cuotas} onChange={(e) => set("cuotas", Number(e.target.value))} className={`mt-1.5 w-full ${tema.input}`}>
                    {[1, 3, 6, 12]
                      .filter((c) => c <= config.cuotasSinInteres)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c === 1 ? `1 pago de ${pesos(total)}` : `${c} cuotas sin interés de ${pesos(cuota(total, c))}`}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {paso > 1 ? (
              <button type="button" className={`inline-flex items-center justify-center gap-2 ${tema.botonSec}`} onClick={() => setPaso((paso - 1) as Paso)} disabled={estado === "procesando"}>
                <IconoVolver className="size-4" trazo={trazo} /> Volver
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className={`${tema.boton} ${paso === 3 ? "sm:min-w-[300px]" : ""}`} disabled={estado === "procesando" || lineas.length === 0}>
              {estado === "procesando" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" aria-hidden="true" />
                  Conectando con Mercado Pago…
                </span>
              ) : paso === 3 ? (
                `Pagar ${pesos(total)} con Mercado Pago`
              ) : (
                "Continuar"
              )}
            </button>
          </div>
          <p className="sr-only" aria-live="assertive">
            {Object.keys(errores).filter((k) => errores[k as keyof Datos]).length ? "Revisá los campos marcados." : estado === "procesando" ? "Procesando el pago simulado." : ""}
          </p>
          <p className={`mt-6 flex items-center gap-2 text-xs ${tema.suave}`}>
            <IconoCandado className="size-4" trazo={trazo} /> Demo: nada de lo que completes sale de tu navegador.
          </p>
        </form>
      </div>
      <div className={`md:border-l ${tema.borde} ${tema.superficie}`}>{resumen}</div>
    </div>
  );
}
