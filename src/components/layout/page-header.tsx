export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}