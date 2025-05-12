const router = require("express").Router();
const { getAllBooks, getBookById, addBook } = require("../models/books");

// Get all books
router.get("/books", async (req, res) => {
  const books = await getAllBooks();
  if (!books) {
    return res.status(500).render("error", { message: "Failed to fetch books" });
  }
  res.render("books/index", { title: "All Books", books });
});

// Get form to add a new book
router.get("/books/new", (req, res) => {
  res.render("books/new", { title: "Add New Book" });
});

// Get a single book by ID
router.get("/books/:id", async (req, res) => {
  const book = await getBookById(req.params.id);
  if (!book) {
    return res.status(404).render("error", { message: "Book not found" });
  }
  res.render("books/show", { title: book.title, book });
});

// Add a new book (POST)
router.post("/books", async (req, res) => {
  const { author, title, isbn } = req.body;
  
  // Basic validation
  if (!author || !title || !isbn) {
    return res.status(400).render("books/new", { 
      title: "Add New Book",
      error: "All fields are required",
      book: { author, title, isbn }
    });
  }
  
  const result = await addBook({ author, title, isbn });
  if (!result) {
    return res.status(500).render("books/new", { 
      title: "Add New Book",
      error: "Failed to add book",
      book: { author, title, isbn }
    });
  }
  
  res.redirect("/books");
});

module.exports = router;