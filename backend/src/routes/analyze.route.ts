import { Router } from "express";
import { analyzeRequestSchema } from "../schemas/analyzeRequest.schema.js";
import { AppError } from "../errors/appError.js";
import { runResearch } from "../services/research.service.js";

export const analyzeRouter = Router();

analyzeRouter.post("/", async (req, res, next) => {
  try {
    const parsed = analyzeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("BAD_REQUEST", "Please enter a valid public company name.", 400);
    }

    const report = await runResearch(parsed.data.company);
    res.json(report);
  } catch (error) {
    next(error);
  }
});
