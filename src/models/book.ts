import { model, Document, Schema, Model } from "mongoose";
import { IAuthor } from "./author";

export interface IBook extends Document {
  title: string;
  subtitle?: string;
  pageCount: number;
  authors: IAuthor[];
}

const BookSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  subtitle: { type: String, maxLength: 100 },
  pageCount: { type: Number, required: true, min: 0, max: 32666 },
  authors: [{ type: Schema.Types.ObjectId, ref: "Author", required: true }],
});

BookSchema.virtual("url").get(function (this: IBook) {
  return "authors/" + this._id;
});

const Book: Model<IBook> = model("BookSchema", BookSchema);

export default Book;
