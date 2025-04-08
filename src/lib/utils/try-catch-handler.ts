import ApiCustomError from "@/types/api-custom-error";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/utils/logger";

export const tryCatchHandler = async <T>(
  fn: () => Promise<T>,
): Promise<T | ApiCustomError> => {
  try {
    return await fn();

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error({ error }, `Prisma known request error: ${error.message}`);
      return new ApiCustomError(error.message, 422, {
        originalError: error,
        details: error,
      });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      logger.error({ error }, `Prisma validation error: ${error.message}`);
      return new ApiCustomError(error.message, 422, {
        originalError: error,
        details: error,
      });
    }
    logger.error({ error }, "An unexpected error occurred");
    return new ApiCustomError("An error occurred", 500, {
      originalError: error,
      details: error,
    });
  }
};
