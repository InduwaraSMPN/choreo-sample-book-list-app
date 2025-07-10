import express from "express";
import database from "./database.mjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add a book - request body should contain a title, status and an author
app.post("/reading-list/books", async (req, res) => {
  try {
    const { title, author, status } = req.body;
    const uuid = uuidv4();
    if (!(status === "read" || status === "to_read" || status === "reading")) {
      return res.status(400).json({
        error: "Status is invalid. Accepted statuses: read | to_read | reading",
      });
    }
    if (!title || !author || !status) {
      return res.status(400).json({ error: "Title, Status or Author is empty" });
    }

    await database.addBook(uuid, title, author, status);
    return res.status(201).json({ uuid, title, author });
  } catch (error) {
    console.error('Error adding book:', error);
    return res.status(500).json({ error: "Failed to add book" });
  }
});

// update status of a book by uuid
app.put("/reading-list/books/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const { status } = req.body;
    if (!uuid || typeof uuid !== "string") {
      return res.status(400).json({ error: "missing or invalid UUID" });
    }

    const bookExists = await database.bookExists(uuid);
    if (!bookExists) {
      return res.status(404).json({ error: "UUID does not exist" });
    }

    if (!(status === "read" || status === "to_read" || status === "reading")) {
      return res.status(400).json({
        error: "Status is invalid. Accepted statuses: read | to_read | reading",
      });
    }

    await database.updateBookStatus(uuid, status);
    return res.json({ uuid, status });
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ error: "Failed to update book" });
  }
});

// get the list of books
app.get("/reading-list/books", async (_, res) => {
  try {
    const allData = await database.getAllBooks();
    return res.json(allData);
  } catch (error) {
    console.error('Error getting all books:', error);
    return res.status(500).json({ error: "Failed to retrieve books" });
  }
});

// get a book by uuid
app.get("/reading-list/books/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    if (!uuid || typeof uuid !== "string") {
      return res.status(400).json({ error: "missing or invalid UUID" });
    }

    const book = await database.getBook(uuid);
    if (!book) {
      return res.status(404).json({ error: "UUID does not exist" });
    }

    return res.json(book);
  } catch (error) {
    console.error('Error getting book:', error);
    return res.status(500).json({ error: "Failed to retrieve book" });
  }
});

// delete a book by uuid
app.delete("/reading-list/books/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    if (!uuid || typeof uuid !== "string") {
      return res.status(400).json({ error: "missing or invalid UUID" });
    }

    const deleted = await database.deleteBook(uuid);
    if (!deleted) {
      return res.status(404).json({ error: "UUID does not exist" });
    }

    return res.json({ uuid });
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ error: "Failed to delete book" });
  }
});

// health check
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});

export default app;
