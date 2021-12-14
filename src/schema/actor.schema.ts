import * as Joi from 'joi';

export const get = Joi.object({
  query: Joi.object({
    query: Joi.string().required(),
  }),
}).unknown(true);
