import mongoose, { Document, Model, Schema } from "mongoose";
import { IAuthor } from "./author";

export interface IBook extends Document {
  title: string;
  subtitle?: string;
  pageCount: number;
  authors: IAuthor["_id"];
}

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  subtitle: { type: String, maxLength: 100 },
  pageCount: { type: Number, required: true, min: 0, max: 32666 },
  authors: [{ type: Schema.Types.ObjectId, ref: "Author", required: true }],
});

BookSchema.virtual("url").get(function (this: IBook) {
  return "/api/books/" + this._id;
});

const Book: Model<IBook> = mongoose.model("Book", BookSchema);

export default Book;
