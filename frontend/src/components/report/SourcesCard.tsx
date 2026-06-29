import type { SourceReference } from "../../types/research.js";

type Props = {
  sources: SourceReference[];
};

export const SourcesCard = ({ sources }: Props) => (
  <section id="sources" className="dashboard-panel rounded-xl p-5">
    <h2 className="text-lg font-semibold">Sources</h2>
    {sources.length ? (
      <div className="mt-4 grid gap-3">
        {sources.map((source) => (
          <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border bg-[#10130f] p-3 hover:bg-[#202420]">
            <span className="block font-medium">{source.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {source.domain} - {source.sourceType} {source.publishedAt ? `- ${new Date(source.publishedAt).toLocaleDateString()}` : ""}
            </span>
          </a>
        ))}
      </div>
    ) : (
      <p className="mt-3 text-sm text-muted-foreground">No sources returned.</p>
    )}
  </section>
);
