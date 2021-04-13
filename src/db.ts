// getBooks
// getBookById

export interface Book {
  title: string;
  id: string;
}

export interface BookPayload {
  title?: string;
}

export const db: Book[] = [
  { title: "The Well of Eternity", id: "0" },
  { title: "The Demon Soul", id: "1" },
  { title: "The Sundering", id: "2" },
];

export function getBookById(id: string): Book | undefined {
  return db.find((book) => book.id === id);
}
