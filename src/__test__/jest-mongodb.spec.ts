import { Db, MongoClient } from "mongodb";

describe("insert", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  test("it works", () => {
    expect(true).toBe(true);
  });
});
