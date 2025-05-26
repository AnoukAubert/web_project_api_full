const router = require("express").Router();
const { celebrate, Joi, Segments } = require('celebrate')
const {createUser, login} = require("../controllers/users");

router.post("/signin", celebrate({
  [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
   })
  }), login);

router.post("/signup", celebrate({
  [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8)
   })
  }), createUser);

module.exports = router;