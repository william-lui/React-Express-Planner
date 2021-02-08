const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quoteSchema = new Schema(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const featuredSchema = new Schema(
  {
    featuredQuote: { type: String, required: true },
    featuredAuthor: { type: String, required: true },
    featured: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Quotes = mongoose.model("Quotes", quoteSchema);
const FeaturedQuote = mongoose.model("FeaturedQuote", featuredSchema);

module.exports.Quotes = Quotes;
module.exports.FeaturedQuote = FeaturedQuote;
