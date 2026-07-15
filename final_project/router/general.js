const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



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
// Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        // Await the books object directly (JavaScript implicitly wraps it in a resolved promise)
        const fetchedBooks = await books;

        // Send the formatted JSON response
        return res.status(200).send(JSON.stringify(fetchedBooks, null, 4));
        
    } catch (error) {
        // Handle any errors that might occur
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        
        // Await the specific book object directly
        const fetchedBook = await books[isbn];

        // Check if the book actually exists
        if (fetchedBook) {
            return res.status(200).send(JSON.stringify(fetchedBook, null, 4));
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
        
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
// Get book details based on author using async/await directly
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        
        // Await the books object directly (implicitly wrapped in a resolved promise)
        const fetchedBooks = await books;

        // Obtain all keys for the 'fetchedBooks' object
        const keys = Object.keys(fetchedBooks);

        // Iterate and collect matching books
        let matchingBooks = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (fetchedBooks[key].author === author) {
                matchingBooks.push(fetchedBooks[key]);
            }
        }

        // Check if any matching books were actually found
        if (matchingBooks.length > 0) {
            return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
        
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ message: "Error fetching book details" });
    }
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

// Get all books based on title using async/await directly
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        
        // Await the books object directly (implicitly wrapped in a resolved promise)
        const fetchedBooks = await books;

        // Obtain all keys for the 'fetchedBooks' object
        const keys = Object.keys(fetchedBooks);

        // Iterate and collect matching books
        let matchingTitle = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (fetchedBooks[key].title === title) {
                matchingTitle.push(fetchedBooks[key]);
            }
        }

        // Check if any matching books were actually found
        if (matchingTitle.length > 0) {
            return res.status(200).send(JSON.stringify(matchingTitle, null, 4));
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
        
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ message: "Error fetching book details" });
    }
});




  
module.exports.general = public_users;
