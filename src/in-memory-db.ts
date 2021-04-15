export interface InMemoryBook {
  title: string;
  id: string;
}

export interface InMemoryBookPayload {
  title?: string;
}

export const inMemoryDB: InMemoryBook[] = [
  { title: "The Well of Eternity", id: "0" },
  { title: "The Demon Soul", id: "1" },
  { title: "The Sundering", id: "2" },
];

export function getBookById(id: string): InMemoryBook | undefined {
  return inMemoryDB.find((book) => book.id === id);
}
