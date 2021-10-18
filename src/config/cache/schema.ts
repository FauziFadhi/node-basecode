import * as Joi from 'joi';

export default Joi.object({
  CACHE_HOST: Joi.string().required(),
  CACHE_PORT: Joi.number().required().default(6379),
  CACHE_PREFIX: Joi.string().required(),
  CACHE_TTL: Joi.number().required().default(1000),
  CACHE_PASSWORD: Joi.string().required(),
});
