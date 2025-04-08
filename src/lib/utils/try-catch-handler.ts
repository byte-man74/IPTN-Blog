import ApiCustomError from "@/types/api-custom-error";
import { Prisma } from "@prisma/client";

export const tryCatchHandler = async <T>(
  fn: () => Promise<T>,
): Promise<T | ApiCustomError> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new ApiCustomError(error.message, 422, {
        originalError: error,
        details: error,
      });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return new ApiCustomError(error.message, 422, {
        originalError: error,
        details: error,
      });
    }

    return new ApiCustomError("An error occurred", 500, {
      originalError: error,
      details: error,
    });
  }
};
