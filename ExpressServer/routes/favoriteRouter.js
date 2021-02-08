const express = require("express");
const bodyParser = require("body-parser");

const Favorites = require("../models/favorites");
const cors = require("./cors");
const authenticate = require("../authenticate");
const ObjectId = require("mongoose").Types.ObjectId;

favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

const addDishesToFavorite = (dishes, favorite) => {
  dishes.forEach((dish) => {
    if (favorite.dishes.indexOf(dish._id) == -1) {
      favorite.dishes.push(dish._id);
    }
  });

  return favorite.save();
};

favoriteRouter
  .route("/")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: ObjectId(req.user._id) })
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: ObjectId(req.user._id) })
      .then(
        (favorite) => {
          if (favorite == null) {
            Favorites.create({ user: req.user._id })
              .then(
                (fav) => {
                  addDishesToFavorite(req.body, fav)
                    .then(
                      (favorite) => {
                        Favorites.findById(favorite._id)
                          .populate("user")
                          .populate("dishes")
                          .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                          });
                      },
                      (err) => next(err)
                    )
                    .catch((err) => next(err));
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            addDishesToFavorite(req.body, favorite)
              .then(
                (favorite) => {
                  Favorites.findById(favorite._id)
                    .populate("user")
                    .populate("dishes")
                    .then((favorite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("put not supported for " + "/favorites");
  })
  .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({ user: ObjectId(req.user._id) })
      .then(
        (fav) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(fav);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorites) => {
          if (!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorites: favorites });
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favorites: favorites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favorites: favorites });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: ObjectId(req.user._id) })
      .then(
        (favorite) => {
          if (favorite == null) {
            Favorites.create({ user: req.user._id })
              .then(
                (fav) => {
                  addDishesToFavorite(req.body, fav)
                    .then(
                      (favorite) => {
                        Favorites.findById(favorite._id)
                          .populate("user")
                          .populate("dishes")
                          .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                          });
                      },
                      (err) => next(err)
                    )
                    .catch((err) => next(err));
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            addDishesToFavorite([{ _id: req.params.dishId }], favorite)
              .then(
                (favorite) => {
                  Favorites.findById(favorite._id)
                    .populate("user")
                    .populate("dishes")
                    .then((favorite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("put not supported for " + "/favorites");
  })
  .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: ObjectId(req.user._id) })
      .then(
        (favorite) => {
          if (favorite == null) {
            let err = new Error("Favorite does not exist");
            err.status = 404;
            return next(err);
          } else {
            favorite.dishes.splice(req.params.dishId, 1);

            favorite
              .save()
              .then(
                (favorite) => {
                  Favorites.findById(favorite._id)
                    .populate("user")
                    .populate("dishes")
                    .then((favorite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
