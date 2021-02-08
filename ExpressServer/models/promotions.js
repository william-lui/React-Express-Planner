const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    totalNutrients: Schema.Types.Mixed,
    ingredientLines: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Promotions = mongoose.model("Promotion", promotionSchema);
module.exports = Promotions;
