import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  subtitle: { type: String, maxLength: 100 },
  pageCount: { type: Number, required: true, min: 0, max: 32666 },
  authors: [{ type: Schema.Types.ObjectId, ref: "Author", required: true }],
});

BookSchema.virtual("url").get(function () {
  return "authors/" + this._id;
});

export default mongoose.model("BookSchema", BookSchema);
