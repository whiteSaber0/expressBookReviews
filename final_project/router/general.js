const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
  return res.status(200).send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
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
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;


