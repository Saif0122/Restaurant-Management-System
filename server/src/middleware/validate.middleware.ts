import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants';

/**
 * Reusable validation middleware that validates incoming request body, query, and params against a Zod schema.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (schema: ZodSchema<any>): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign the parsed/coerced data back to request to ensure type safety in controllers
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => {
          const location = issue.path[0];
          const field = issue.path.slice(1).join('.') || String(location);
          return {
            field,
            message: issue.message,
          };
        });

        next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation Error', errors));
      } else {
        next(error);
      }
    }
  };
};
