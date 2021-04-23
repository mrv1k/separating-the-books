// based on: https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
import mongoose, { Document, Model, Schema, Types } from "mongoose";

import { AuthorDocument } from "./author";

const BookSchema = new mongoose.Schema<BookDocument, BookModel>({
  title: { type: String, required: true, maxLength: 100 },
  subtitle: { type: String, maxLength: 100 },
  pageCount: { type: Number, required: true, min: 0, max: 32666 },
  authors: [{ type: Schema.Types.ObjectId, ref: "Author", required: true }],
});

// ES Types, except for ID
export interface Book {
  title: string;
  subtitle?: string;
  pageCount: number;
  authors: Types.ObjectId[] | AuthorDocument[] | Record<string, unknown>;
}

// Mongoose Types, not exported because author field is non deterministic
interface BookBaseDocument extends Book, Document {
  url: string;
}

export interface BookDocument extends BookBaseDocument {
  authors: AuthorDocument["_id"][];
}

export interface BookPopulatedDocument extends BookBaseDocument {
  authors: AuthorDocument[];
}

BookSchema.virtual("url").get(function (this: BookBaseDocument) {
  return "/api/books/" + this._id;
});

type BookModel = Model<BookDocument>;

export default mongoose.model<BookDocument, BookModel>("Book", BookSchema);
