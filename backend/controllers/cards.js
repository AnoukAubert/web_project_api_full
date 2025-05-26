const Card = require("../models/card");
const { handleErrors } = require("../utils/utils");

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => handleErrors(error, res));
};

const getCard = (req, res) => {
  const id = req.params.id;
  Card.findById(id)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((error) => handleErrors(error, res));
};

const storeCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => {
      Card.findById(card._id)
        .populate("owner")
        .then((cardObj) => {
          res.send(cardObj);
        });
    })
    .catch((error) => handleErrors(error, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      res.send(card);
    })
    .catch((error) => handleErrors(error, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      res.send(card);
    })
    .catch((error) => handleErrors(error, res));
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .orFail()
    .then(() => {
      res.send({ status: true });
    })
    .catch((error) => handleErrors(error, res));
};

module.exports = {
  getAllCards,
  storeCard,
  likeCard,
  dislikeCard,
  deleteCard,
  getCard,
};
