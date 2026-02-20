import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
// import { MESSAGES } from "../const/message";
import { AppError } from "../utils/errorHandler";
const validate =
  (schema: ObjectSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {

      const { error } = schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const details = error.details.map((d) => d.message);
        const message = details.join(", ");
        // console.log(message);

        throw new AppError(message, 400);
      }

      next();
    };

export default validate;
