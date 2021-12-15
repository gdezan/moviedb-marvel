import * as Joi from 'joi';

export const getSummary = Joi.object({
  query: Joi.object({
    query: Joi.string().required(),
  }),
}).unknown(true);

export const getCommonCharacters = Joi.object({
  query: Joi.object({
    actors: Joi.array().items(Joi.string()).min(2).required(),
  }),
}).unknown(true);
