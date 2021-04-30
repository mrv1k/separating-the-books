import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer: MongoMemoryServer;
const opts = { useUnifiedTopology: true, useNewUrlParser: true }; // remove this option if you use mongoose 5 and above

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("...", () => {
  it("...", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const count = await User.count();
    expect(count).toEqual(0);
  });
});
