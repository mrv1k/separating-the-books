import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("wawawewa!");
});

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
