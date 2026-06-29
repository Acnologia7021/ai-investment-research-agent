import { AlertTriangle, RotateCcw, Search } from "lucide-react";

type Props = {
  message: string;
  onRetry?: (() => void) | undefined;
  onNewSearch?: (() => void | Promise<void>) | undefined;
};

export const ErrorPanel = ({ message, onRetry, onNewSearch }: Props) => (
  <section className="dashboard-panel border-[#55302f] bg-[#241716] rounded-lg p-5 text-[#ffd5d2]">
    <div className="flex items-start gap-3">
      <AlertTriangle aria-hidden="true" size={22} className="mt-0.5 text-[#ff6b63]" />
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-[#fff1ef]">Research could not be completed</h2>
        <p className="mt-1 text-sm leading-6 text-[#f0aaa5]">{message}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-md border border-[#6f3d3a] px-3 py-2 text-sm font-semibold hover:bg-[#321d1b]"
            >
              <RotateCcw size={16} /> Retry
            </button>
          ) : null}
          {onNewSearch ? (
            <button
              type="button"
              onClick={onNewSearch}
              className="inline-flex items-center gap-2 rounded-md bg-[#ff6b63] px-3 py-2 text-sm font-semibold text-[#160807]"
            >
              <Search size={16} /> New search
            </button>
          ) : null}
        </div>
      </div>
    </div>
  </section>
);
