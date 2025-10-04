const mongoose = require("mongoose");

const FavoritePagesSchema = new mongoose.Schema(
  {
    visitor: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      email: { type: String, required: true }
    },
    page: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true },
      title: { type: String, required: true }
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model("FavoritePages", FavoritePagesSchema);
