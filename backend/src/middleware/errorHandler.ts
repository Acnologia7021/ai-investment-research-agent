import type { ErrorRequestHandler } from "express";
import { isAppError } from "../errors/appError.js";
import { logger } from "../config/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isAppError(error)) {
    logger.warn({ err: error, code: error.code }, error.message);
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  logger.error({ err: error }, "Unexpected internal error");
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong while processing the request."
    }
  });
};
