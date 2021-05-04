import mongoose from "mongoose";

export const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

class DB {
  async start(): Promise<void> {
    const uri = `${process.env.MONGO_URI}${process.env.MONGO_DB_NAME}`;
    await mongoose.connect(uri, options);
  }
}

export default new DB();

// import AuthorModel from "@/models/author";
// import BookModel from "@/models/book";

// const author = await AuthorModel.create({
//   first_name: "Richard",
//   last_name: "Knaak",
// });

// await BookModel.create({
//   title: "The Well of Eternity",
//   pageCount: 370,
//   authors: [author._id],
// });
