type Props = {
  searches: string[];
  onSelect: (company: string) => void;
};

export const RecentSearches = ({ searches, onSelect }: Props) => {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent searches</h2>
      <div className="flex flex-wrap gap-2">
        {searches.map((company) => (
          <button
            key={company}
            type="button"
            className="rounded-lg border border-border bg-[#141715] px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/60 hover:bg-[#202420] hover:text-foreground"
            onClick={() => onSelect(company)}
          >
            {company}
          </button>
        ))}
      </div>
    </div>
  );
};
