type Props = {
  id?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Section({ id, title, intro, children, className = "" }: Props) {
  const headingId = id ? `${id}-titulo` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`col mt-24 md:mt-32 ${className}`}>
      <h2 id={headingId} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {intro ? <p className="mt-3 text-muted">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}
