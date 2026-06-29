import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient.js";
import type { ResearchReport } from "../types/research.js";

export const useCompanyAnalysis = () => {
  return useMutation({
    mutationFn: async (company: string) => {
      const response = await apiClient.post<ResearchReport>("/analyze", { company });
      return response.data;
    }
  });
};
