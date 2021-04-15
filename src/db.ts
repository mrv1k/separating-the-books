import mongoose from "mongoose";

const mongoDB = "mongodb://127.0.0.1/separating_the_books";
mongoose.connect(mongoDB, { useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
