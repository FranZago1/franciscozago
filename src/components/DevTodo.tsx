/** Marca visible solo en desarrollo para contenido pendiente. En producción no se renderiza. */
export function DevTodo({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-black">
      TODO: {children}
    </span>
  );
}
