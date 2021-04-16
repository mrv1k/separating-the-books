import mongoose, { Document, Model } from "mongoose";

export interface IAuthor extends Document {
  first_name: string;
  last_name: string;
}

const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
});

AuthorSchema.virtual("name").get(function (this: IAuthor) {
  return this.first_name + this.last_name;
});

AuthorSchema.virtual("url").get(function (this: IAuthor) {
  return "/api/authors/" + this._id;
});

const Author: Model<IAuthor> = mongoose.model("AuthorSchema", AuthorSchema);

export default Author;
