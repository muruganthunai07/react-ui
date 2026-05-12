import { z } from 'zod';

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(err => err.message).join(', ');
      throw new Error(message);
    }
    throw error;
  }
}

export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(err => err.message).join(', ');
      throw new Error(message);
    }
    throw error;
  }
}

export function createValidationError(message: string): Error {
  return new Error(message);
}

export function isValidationError(error: unknown): error is Error {
  return error instanceof Error && error.name === 'ZodError';
} 