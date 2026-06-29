export type ErrorCode =
  | "BAD_REQUEST"
  | "INVALID_COMPANY"
  | "AMBIGUOUS_COMPANY"
  | "PRIVATE_COMPANY"
  | "PROVIDER_RATE_LIMIT"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_ERROR"
  | "MISSING_CONFIGURATION"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  public constructor(code: ErrorCode, message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
