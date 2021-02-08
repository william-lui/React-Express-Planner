const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dishes: [{ type: Schema.Types.ObjectId, ref: "Dish" }],
});

const Favorites = mongoose.model("Favorites", favoritesSchema);
module.exports = Favorites;
