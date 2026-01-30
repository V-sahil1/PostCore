import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // return all errors
    });

    if (error) {
      res.status(400).json({
        message: "Validation error",
        details: error.details.map(d => d.message),
      });
      return;
    }

    next();
  };

export default validate;
