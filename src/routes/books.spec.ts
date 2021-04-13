import supertest from "supertest";
import { app } from "../app";

describe("/api/books", () => {
  it("GET /", (done) => {
    const r = supertest(app);
    const get = r.get("/api/books");

    get.expect("Content-Type", /json/).expect(200, done);
  });
});
