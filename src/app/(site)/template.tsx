/** Se vuelve a montar en cada navegación: la página entra con un fundido suave (ver .entrada en globals.css). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrada">{children}</div>;
}
