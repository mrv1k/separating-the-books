import request from "supertest";
import myapp from "../index";

describe("/books", () => {
  it("GET /", (done) => {
    const r = request(myapp);
    const get = r.get("/");

    get.expect("Content-Type", /json/).expect(200, done);
  });
});
