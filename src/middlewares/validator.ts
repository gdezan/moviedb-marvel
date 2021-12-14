import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import ApiError from '../utils/ApiError';

export default class Validator {
  static validate(schema: Joi.Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req, { abortEarly: false });

      if (!error) {
        next();
        return;
      }

      next(ApiError.validationError(error));
    };
  }
}
