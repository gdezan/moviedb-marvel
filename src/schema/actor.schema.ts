import * as Joi from 'joi';

export const get = Joi.object({
  query: Joi.object({
    foo: Joi.number().required(),
    bar: Joi.number().required(),
  }),
}).unknown(true);
