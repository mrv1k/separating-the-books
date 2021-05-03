import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Mongoose } from "mongoose";

import { options } from "@/db";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60_000;

export default class TestDB {
  server = new MongoMemoryServer();
  client?: Mongoose;
  connection?: Connection;

  async start(): Promise<void> {
    const dbUri = await this.server.getUri();
    this.client = await mongoose.connect(dbUri, options);
    this.connection = this.client.connection;
  }

  async stop(): Promise<boolean> {
    await this.client?.disconnect();
    return await this.server.stop();
  }

  async cleanup(): Promise<boolean[] | undefined> {
    if (this.connection === undefined) return;
    const db = this.connection.db;

    const collections = await db.listCollections().toArray();

    return Promise.all(
      collections
        .map((collection) => collection.name)
        .map((collection) => db.dropCollection(collection))
    );
  }
}
