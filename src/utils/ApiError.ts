import { ValidationError } from 'joi';

export default class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static validationError(error: ValidationError) {
    const { details } = error;
    const detailsList = details.map((i) => i.message);

    return new ApiError(422, detailsList.join(' - '));
  }

  static internal(message: string) {
    return new ApiError(500, message);
  }
}
