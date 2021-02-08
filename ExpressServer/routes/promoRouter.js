const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

const Promotions = require("../models/promotions");
let authenticate = require("../authenticate");

const cors = require("./cors");

promoRouter
  .route("/")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.find(req.query)
      .then(
        (promos) => {
          if (promos.length !== 0) {
            let lastCreatedDate = new Date(Date.parse(promos[0].createdAt));
            let todayDate = new Date();

            if (lastCreatedDate.getDay() !== todayDate.getDay()) {
              Promotions.remove({})
                .then(
                  () => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json([]);
                  },
                  (err) => next(err)
                )
                .catch((err) => next(err));
            }
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },

        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOption, (req, res, next) => {
    console.log(req.body);
    req.body.forEach((promo) => {
      Promotions.findOneAndUpdate(
        { label: promo.label },
        {
          $set: {
            image: promo.recipe.image,
            label: promo.recipe.label,
            calories: promo.recipe.calories,
            totalNutrients: promo.recipe.totalNutrients,
            ingredientLines: promo.recipe.ingredientLines,
          },
        },
        { upsert: true, new: true }
      ).then((food) => {
        food.save().catch((err) => next(err));
      });
    });

    Promotions.find(req.query)
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin(),
    (req, res, next) => {
      res.statusCode = 403;
      res.end("put not supported for /promotions");
    }
  )
  .delete(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin(),
    (req, res, next) => {
      Promotions.remove({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

promoRouter
  .route("/:promoId")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin(),
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "POST operation not supported on /promotions/" + req.params.promoId
      );
    }
  )
  .put(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin(),
    (req, res, next) => {
      Promotions.findByIdAndUpdate(
        req.params.promoId,
        { $set: req.body },
        { new: true }
      )
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin(),
    (req, res, next) => {
      Promotions.findByIdAndRemove(req.params.promoId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = promoRouter;
