export function TrustBadge({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="surface-card">
      <div className="card-body gap-2 p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          {label}
        </p>
        <p className="font-display text-xl font-semibold text-primary">
          {value}
        </p>
        <p className="text-sm leading-relaxed text-base-content/65">
          {description}
        </p>
      </div>
    </div>
  );
}
