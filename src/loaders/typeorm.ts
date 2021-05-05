import { ConnectionOptions, createConnection } from "typeorm";

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["src/entity/**/*.ts"],
  synchronize: true,
};

class DB {
  async start() {
    try {
      await createConnection(config);
    } catch (error) {
      console.error("Failed to connect the database", error);
      return error;
    }
  }
}

export default new DB();
