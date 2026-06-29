import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "ai-investment-research-agent",
    timestamp: new Date().toISOString()
  });
});
