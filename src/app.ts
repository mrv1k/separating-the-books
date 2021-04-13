import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404);
  res.json({ error: "No, can do" });
});

const server = () => {
  // fix for: "Jest has detected the following 1 open handle potentially keeping Jest from exiting"
  if (process.env.NODE_ENV === "test") return;

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
  });
  return server;
};

export default server();
export { app };
