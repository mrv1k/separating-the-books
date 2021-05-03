import mongoose from "mongoose";

// import AuthorModel from "@/models/author";
// import BookModel from "@/models/book";

export default async function launchMongoDB(): Promise<mongoose.Connection> {
  const dbUri = `${process.env.MONGO_URI}${process.env.MONGO_DB_NAME}`;
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  mongoose.connection.once("open", function () {
    console.log("test test, do you copy? open", dbUri);
  });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
  );

  // const author = await AuthorModel.create({
  //   first_name: "Richard",
  //   last_name: "Knaak",
  // });

  // await BookModel.create({
  //   title: "The Well of Eternity",
  //   pageCount: 370,
  //   authors: [author._id],
  // });

  return mongoose.connection;
}
