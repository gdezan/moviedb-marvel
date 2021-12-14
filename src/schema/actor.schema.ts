import * as Joi from 'joi';

export const movies = Joi.object({
  query: Joi.object({
    query: Joi.string().required(),
  }),
}).unknown(true);
