const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate')

const {getAllCards, storeCard, deleteCard, dislikeCard, likeCard, getCard} = require("../controllers/cards");

router.get('/cards', getAllCards);
router.get('/cards/:id', getCard);

router.post('/cards',celebrate({
  [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(5).max(40),
      link: Joi.string().required().uri()
   })
  }), storeCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/likes/:cardId', likeCard)
router.delete('/cards/likes/:cardId', dislikeCard)


module.exports = router;

