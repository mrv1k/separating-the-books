import express from "express";
import request from "supertest";
import myapp from "../index";

describe("myapp", () => {
  it("works", (done) => {
    const r = request(myapp);
    const get = r.get("/");

    get.expect("Content-Type", /json/).expect(200, done);
  });
});
