import Author from "./models/author";
import Book from "./models/book";
import mongoose from "mongoose";

(async function () {
  const mongoDB = "mongodb://localhost:27017/separating_the_books";
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  const author = await Author.create({
    first_name: "Richard",
    last_name: "Knaak",
  });

  const book = await Book.create({
    title: "The Well of Eternity",
    pageCount: 370,
    authors: [author],
  });

  const query = await Author.findOne({ last_name: "Knaak" });
  console.log(query);
})();
