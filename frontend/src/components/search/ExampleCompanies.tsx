const examples = ["Apple", "Microsoft", "Tesla", "Tata Motors"];

type Props = {
  onSelect: (company: string) => void;
};

export const ExampleCompanies = ({ onSelect }: Props) => (
  <div className="flex flex-wrap gap-2">
    {examples.map((company) => (
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
);
