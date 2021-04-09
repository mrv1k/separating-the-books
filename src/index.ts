import express from "express";
import { json } from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("wawawewa!");
});

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
