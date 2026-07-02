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
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].rev));
 });
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

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

    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    // Obtain all keys for the 'books' object
    const keys = Object.keys(books);

    // Iterate and collect matching books
    let matchingTitle = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (books[key].title === title) {
            matchingTitle.push(books[key]);
        }
    }

    return res.status(200).send(JSON.stringify(matchingTitle, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  const Book = books[ISBN];
  if (Book) {
    return res.status(200).send(JSON.stringify(Book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;

