// routes/books.js
const express = require("express");
const router = express.Router();

// Data dummy buku
const books = [
  { id: 1, title: "Belajar Node.js", author: "Bagus Adnan" },
  { id: 2, title: "Express untuk Pemula", author: "Jane Doe" },
];

// GET semua buku
router.get("/", (req, res) => {
  res.json(books);
});

// GET buku berdasarkan ID
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
  res.json(book);
});

// POST buku baru
router.post("/", (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// ⚠️ Penting: ekspor router
module.exports = router;
