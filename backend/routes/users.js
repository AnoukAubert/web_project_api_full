const router = require("express").Router();
const User = require("../models/user");
const {getAllUsers, me, updateAvatar, getUser, createUser, updateUser} = require("../controllers/users");
const {Joi, Segments, celebrate } = require('celebrate');

router.get('/users/me', me);

router.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(5).max(40),
      about: Joi.string().required().min(5).max(200)
   })
  }), updateUser);

router.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required().uri(),
   })
  }), updateAvatar);

router.get("/users",getAllUsers );

router.get("/users/:id", getUser);

module.exports = router;
