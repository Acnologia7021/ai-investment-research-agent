import type { NewsArticle } from "../../types/research.js";

type Props = {
  article: NewsArticle;
};

export const NewsCard = ({ article }: Props) => (
  <article className="rounded-lg border border-border bg-[#10130f] p-4 transition hover:border-border hover:bg-[#171b18]">
    <h3 className="line-clamp-2 font-semibold leading-6">{article.title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      {article.domain} {article.publishedAt ? `- ${new Date(article.publishedAt).toLocaleDateString()}` : ""}
    </p>
    {article.summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.summary}</p> : null}
    <a className="mt-3 inline-block text-sm font-semibold text-primary hover:underline" href={article.url} target="_blank" rel="noopener noreferrer">
      {article.domain}
    </a>
  </article>
);
