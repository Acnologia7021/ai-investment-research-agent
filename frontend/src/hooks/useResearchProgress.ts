import type { ProgressEvent } from "../services/researchStream.js";

export const useResearchProgress = () => {
  const events: ProgressEvent[] = [];
  return { events };
};
