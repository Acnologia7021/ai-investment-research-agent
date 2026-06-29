import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

type Props = {
  onSubmit: (company: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  compact?: boolean;
};

export const CompanySearch = ({ onSubmit, isLoading = false, initialValue = "", compact = false }: Props) => {
  const [company, setCompany] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = company.trim();
    if (!trimmed) {
      setError("Enter a public company name.");
      return;
    }
    setError("");
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className={`${compact ? "h-10 text-sm" : "h-12 text-base"} w-full rounded-lg border border-border bg-[#10130f] px-4 text-foreground outline-none ring-primary transition placeholder:text-muted-foreground focus:ring-2`}
          placeholder="Enter a public company, e.g. Apple"
          aria-label="Company name"
        />
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`${compact ? "h-10 px-4 text-sm" : "h-12 px-5"} inline-flex items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Search size={18} />
        {isLoading ? "Researching" : "Analyze"}
      </button>
    </form>
  );
};
