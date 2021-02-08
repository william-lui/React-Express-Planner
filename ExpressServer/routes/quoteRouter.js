const express = require("express");
const bodyParser = require("body-parser");
const Quotes = require("../models/quotes").Quotes;
const FeaturedQuote = require("../models/quotes").FeaturedQuote;
const auth = require("../authenticate");

const cors = require("./cors");

const quoteRouter = express.Router();
quoteRouter.use(bodyParser.json());

quoteRouter
  .route("/")
  .get(cors.cors, (req, res, next) => {
    Quotes.find(req.query)
      .then(
        (quotes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quotes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOption,
    auth.verifyUser,
    auth.verifyAdmin(),
    (req, res, next) => {
      req.body.forEach((quote) => {
        Quotes.findOneAndUpdate(
          { quote: quote.quote },
          { $set: quote },
          { upsert: true }
        ).then((quote) => {
          quote.save().catch((err) => next(err));
        });
      });

      Quotes.find(req.query)
        .then(
          (quoteContainer) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(quoteContainer);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(cors.corsWithOption, (req, res, next) => {
    res.statusCode = 403;
    res.end("put operation not supported for /quotes");
  })
  .delete(
    cors.corsWithOption,
    auth.verifyUser,
    auth.verifyAdmin(),
    (req, res, next) => {
      Quotes.remove(req.query)
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

quoteRouter
  .route("/featured")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    FeaturedQuote.findOne({ featured: true })
      .then(
        (quote) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quote);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOption,
    auth.verifyUser,
    auth.verifyAdmin(),
    (req, res, next) => {
      FeaturedQuote.create(req.body)
        .then(
          (quote) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(quote);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(cors.corsWithOption, (req, res, next) => {
    FeaturedQuote.findOneAndUpdate({ featured: true }, { $set: req.body })
      .then(
        (newQuote) => {
          newQuote
            .save()
            .then(
              (quote) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(quote);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(
    cors.corsWithOption,
    auth.verifyUser,
    auth.verifyAdmin(),
    (req, res, next) => {
      FeaturedQuote.remove(req.query)
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

module.exports = quoteRouter;
