// const Joi = require('joi');

// const registerSchema = Joi.object({
//   firstName: Joi.string().min(2).max(50).required(),
//   lastName: Joi.string().min(2).max(50).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
//   role: Joi.string().valid('ADMIN', 'WAREHOUSE', 'RETAILER', 'USER').optional()
// });

// const loginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required()
// });

// module.exports = {
//   registerSchema,
//   loginSchema
// };




// src/validation/auth.js
const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$'))
    .required(),
  role: Joi.string().valid('ADMIN', 'WAREHOUSE', 'RETAILER', 'USER').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
