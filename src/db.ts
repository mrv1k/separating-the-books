import mongoose from "mongoose";

const mongoDB = "mongodb://127.0.0.1/separating_the_books";
mongoose.connect(mongoDB, { useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export interface Book {
  title: string;
  id: string;
}

export interface BookPayload {
  title?: string;
}

export const inMemoryDB: Book[] = [
  { title: "The Well of Eternity", id: "0" },
  { title: "The Demon Soul", id: "1" },
  { title: "The Sundering", id: "2" },
];

export function getBookById(id: string): Book | undefined {
  return inMemoryDB.find((book) => book.id === id);
}
