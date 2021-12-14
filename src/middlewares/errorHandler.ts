import { Request, Response, NextFunction } from 'express';

import ApiError from '../utils/ApiError';

type HandledError = ApiError | Error;

const errorHandler = (err: HandledError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  return res.status(500).json({ message: 'Something went wrong' });
};

export default errorHandler;
