import mongoose, { Document, Model, Types } from "mongoose";

const AuthorSchema = new mongoose.Schema<AuthorDocument, AuthorModel>({
  first_name: { type: String, required: true, minLength: 2, maxLength: 100 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 100 },
});

export interface Author {
  first_name: string;
  last_name: string;
}

export interface AuthorDocument extends Author, Document {
  name: string;
  url: string;
  _id: Types.ObjectId;
}

AuthorSchema.virtual("name").get(function (this: AuthorDocument) {
  return this.first_name + this.last_name;
});

AuthorSchema.virtual("url").get(function (this: AuthorDocument) {
  return "/api/authors/" + this._id;
});

type AuthorModel = Model<AuthorDocument>;

export default mongoose.model<AuthorDocument, AuthorModel>(
  "Author",
  AuthorSchema
);
