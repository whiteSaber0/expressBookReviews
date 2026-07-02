const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" }); // Updated to 400 Bad Request
    } else if (isValid(username)) {
      return res.status(409).json({ message: "User already exists." }); // Updated to 409 Conflict
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Please login." });
    }
});
  
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    Promise.resolve(books)
      .then((bookList) => {
        return res.status(200).send(JSON.stringify(bookList, null, 4));
      })
      .catch((err) => {
        return res.status(500).send({ error: err.message || 'Internal Server Error' });
      });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // Check local storage first (assuming booksdb is keyed by ISBN, or fetch from your internal endpoint)
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }

    // Fallback/External API call logic if applicable
    const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`);
    
    if (!response.data) {
      return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }

    return res.status(200).json(response.data);
  } catch (err) {
    // Catching 404 from external routing or local handling
    if (err.response?.status === 404) {
      return res.status(404).json({ message: `No book found with ISBN: ${req.params.isbn}` });
    }
    return res.status(500).json({
      error: err.response?.data?.message || err.message || "Internal Server Error",
    });
  }
});
  
// Get book details based on Author (Promise callbacks)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    Promise.resolve()
      .then(() => {
        const keys = Object.keys(books);
        let matchingBooks = [];
        
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          // Use lowercase comparison to prevent strict casing issues (UX improvement)
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]);
          }
        }
  
        return matchingBooks;
      })
      .then((matchingBooks) => {
        // Check if any books were found
        if (matchingBooks.length === 0) {
          return res.status(404).json({ message: `No books found matching author: '${author}'` });
        }
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
      })
      .catch((err) => {
        return res.status(500).send({ error: err.message || "Internal Server Error" });
      });
});

// Get all books based on title using Promise with callback
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        try {
          const keys = Object.keys(books);
          const matchingTitle = [];
  
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // Use lowercase comparison to prevent strict casing issues (UX improvement)
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
              matchingTitle.push(books[key]);
            }
          }
  
          resolve(matchingTitle);
        } catch (err) {
          reject(err);
        }
      });
    };
  
    getBooksByTitle()
      .then((matchingTitle) => {
        // Check if any books were found
        if (matchingTitle.

