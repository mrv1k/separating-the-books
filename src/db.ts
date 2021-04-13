// getBooks
// getBookById

export interface Book {
  title: string;
  id: string;
}

export interface BookPayload {
  title?: string;
}

export const db: Book[] = [{ title: "Sundering", id: "0" }];

export function getBookById(id: string): Book | undefined {
  return db.find((book) => book.id === id);
}
