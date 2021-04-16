import Author from "./models/author";
import Book from "./models/book";
import mongoose from "mongoose";

export default async function launchMongoDB(): Promise<mongoose.Connection> {
  const mongoDB = "mongodb://localhost:27017/separating_the_books";
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once("open", function () {
    console.log("MongoDB Connection open:", mongoDB);
  });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
  );

  const author = await Author.create({
    first_name: "Richard",
    last_name: "Knaak",
  });

  await Book.create({
    title: "The Well of Eternity",
    pageCount: 370,
    authors: [author._id],
  });

  return mongoose.connection;
}
