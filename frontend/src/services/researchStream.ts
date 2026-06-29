export type ProgressEvent = {
  step: string;
  status: "waiting" | "running" | "completed" | "failed";
  message?: string;
};

export const supportsStreamingProgress = false;
