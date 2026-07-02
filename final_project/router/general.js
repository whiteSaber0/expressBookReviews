const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Missing username or password" });
    } else if (isValid(username)) {
      return res.status(404).json({ message: "user already exists." });
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered.  Please login." });
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
const axios = require("axios");

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // Example: replace this URL with the real endpoint your course/task expects
    // (e.g., the API that holds book details)
    const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`);

    // If the book details are in response.data:
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({
      error: err.response?.data?.message || err.message || "Internal Server Error",
    });
  }
});
  

// Get book details based on author
// Get book details based on Author (Promise callbacks)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    Promise.resolve()
      .then(() => {
        // Obtain all keys for the 'books' object
        const keys = Object.keys(books);
  
        // Iterate and collect matching books
        let matchingBooks = [];
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (books[key].author === author) {
            matchingBooks.push(books[key]);
          }
        }
  
        return matchingBooks;
      })
      .then((matchingBooks) => {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
      })
      .catch((err) => {
        return res.status(500).send({ error: err.message || "Internal Server Error" });
      });
  });

// Get all books based on title
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
            if (books[key].title === title) {
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
        return res.status(200).send(JSON.stringify(matchingTitle, null, 4));
      })
      .catch(() => {
        return res.status(500).send('Server error');
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
});

module.exports.general = public_users;


