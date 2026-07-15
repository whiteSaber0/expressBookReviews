const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




// Get all registered users
public_users.get('/users', (req, res) => {
    // Send the users array as a formatted JSON string
    return res.status(200).send(JSON.stringify(users, null, 4));
});

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 1. Check if both username and password are provided
    if (username && password) {
        
        // 2. Check if the username already exists in the users array
        let doesExist = users.filter((user) => {
            return user.username === username;
        });

        // 3. Handle registration logic based on whether the user exists
        if (doesExist.length > 0) {
            return res.status(409).json({ message: "User already exists!" });
        } else {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User " +username +  " successfully registered. Now you can login." });
        }
    }

    // 4. Return an error if username or password is missing
    return res.status(400).json({ message: "Unable to register user. Both username and password are required." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
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
    const isbn = req.params.isbn;
  
    const matchingReviews = (books[isbn] && books[isbn].reviews) ? books[isbn].reviews : [];
  
    return res.status(200).send(JSON.stringify(matchingReviews, null, 4));
  });
module.exports.general = public_users;
