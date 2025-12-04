import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SECRET: Joi.string().required(),
  EXPIREHOURS: Joi.number().required(),
});
