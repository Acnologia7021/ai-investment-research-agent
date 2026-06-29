type Props = {
  title?: string;
  rows?: number;
  className?: string;
};

export const SkeletonPanel = ({ title, rows = 4, className = "" }: Props) => (
  <section className={`dashboard-panel rounded-lg p-5 ${className}`} aria-busy="true">
    {title ? <div className="mb-5 h-4 w-32 rounded skeleton-shimmer" /> : null}
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-10 rounded-md skeleton-shimmer" />
      ))}
    </div>
  </section>
);
