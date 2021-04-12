import express from "express";
import request from "supertest";

const app = express();

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

describe("GET /user", function () {
  it("responds with json", function (done) {
    request(app)
      .get("/user")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
