import mongoose, { Schema } from "mongoose";

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
});

export default mongoose.model("AuthorSchema", AuthorSchema);
