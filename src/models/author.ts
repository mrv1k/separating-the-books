import mongoose, { Schema } from "mongoose";

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
});

AuthorSchema.virtual("name").get(function () {
  console.log(this);
  return this.first_name + this.last_name;
});

AuthorSchema.virtual("url").get(function () {
  return "authors/" + this._id;
});

export default mongoose.model("AuthorSchema", AuthorSchema);
