import { appendProgress, type ResearchState } from "../state.js";

export const normalizeEvidenceNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  const seen = new Set<string>();
  const sources = state.sources.filter((source) => {
    if (seen.has(source.id)) {
      return false;
    }
    seen.add(source.id);
    return true;
  });

  return {
    sources,
    progress: appendProgress(state, { step: "evidence", status: "completed", message: "Evidence normalized" })
  };
};
