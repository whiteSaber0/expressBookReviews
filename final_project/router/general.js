const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * Route: POST /register
 * Description: Registers a new user with a username and password.
 */
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Validate request body
    if (!username || !password) {
      return res.status(404).json({ message: "Missing username or password" });
    } else if (isValid(username)) {
      // Check if username is already taken using external validation function
      return res.status(404).json({ message: "user already exists." });
    } else {
      // Store the new user credentials locally
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Please login." });
    }
});
  
/**
 * Route: GET /
 * Description: Fetches the list of all books using an immediately resolved Promise.
 */
public_users.get('/', function (req, res) {
    // Wrap the local object retrieval in a Promise to simulate asynchronous database operations
    Promise.resolve(books)
      .then((bookList) => {
        // Upon successful resolution, send the complete book collection with formatted JSON
        return res.status(200).send(JSON.stringify(bookList, null, 4));
      })
      .catch((err) => {
        // Error handling: Catch internal failures and respond with a 500 status code
        return res.status(500).send({ error: err.message || 'Internal Server Error' });
      });
});

const axios = require("axios");

/**
 * Route: GET /isbn/:isbn
 * Description: Fetches book details based on ISBN by making an asynchronous HTTP request using Axios.
 */
public_users.get('/isbn/:isbn', async function (req, res) {
  // Use try/catch blocks for clean, readable error handling inside async functions
  try {
    const isbn = req.params.isbn;

    // Await the asynchronous external API call to complete before moving to the next line
    const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`);

    // If the external request succeeds, return the payload back to the client
    return res.status(200).json(response.data);
  } catch (err) {
    // Error Handling: Extract the precise error message from the API response if available,
    // otherwise fallback to a generic error message.
    return res.status(500).json({
      error: err.response?.data?.message || err.message || "Internal Server Error",
    });
  }
});
  
/**
 * Route: GET /author/:author
 * Description: Filters and returns book details matching a specific author via a Promise chain.
 */
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Standardize asynchronous pattern by instantiating an empty Promise chain
    Promise.resolve()
      .then(() => {
        // Task: Scan through local memory storage to match author strings
        const keys = Object.keys(books);
        let matchingBooks = [];
        
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (books[key].author === author) {
            matchingBooks.push(books[key]);
          }
        }
  
        // Pass the filtered list down to the next .then() block
        return matchingBooks;
      })
      .then((matchingBooks) => {
        // ENHANCEMENT: Check if any books were found for the requested author
        if (matchingBooks.length === 0) {
          return res.status(404).json({ message: `No books found for author: ${author}` });
        }
        // Send successfully aggregated data
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
      })
      .catch((err) => {
        // Catch any unforeseen runtime anomalies (e.g., properties of undefined)
        return res.status(500).send({ error: err.message || "Internal Server Error" });
      });
});

/**
 * Route: GET /title/:title
 * Description: Retrieves books matching a specific title using an explicit Promise instantiation.
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Helper function that explicitly constructs a new Promise
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
  
          // Fulfill the Promise by passing the findings to the resolver
          resolve(matchingTitle);
        } catch (err) {
          // Reject the promise if an internal crash happens during data mapping
          reject(err);
        }
      });
    };
  
    // Invoke the custom promise-based function and handle results or failures
    getBooksByTitle()
      .then((matchingTitle) => {
        // ENHANCEMENT: Check if any books were found for the requested title
        if (matchingTitle.length === 0) {
          return res.status(404).json({ message: `No books found with the title: ${title}` });
        }
        return res.status(200).send(JSON.stringify(matchingTitle, null, 4));
      })
      .catch(() => {
        // Simple fallback error tracking response
        return res.status(500).send('Server error');
      });
});

/**
 * Route: GET /review/:isbn
 * Description: Retrieves reviews for a specific book based on its ISBN.
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Use a Promise to look up the book and its reviews asynchronously
    Promise.resolve()
      .then(() => {
        // Check if the book exists in the data store
        if (!books[isbn]) {
          const error = new Error(`Book with ISBN ${isbn} not found`);
          error.status = 404;
          throw error;
        }
        
        // Return the reviews object for the found book
        return books[isbn].reviews;
      })
      .then((reviews) => {
        // Check if the reviews object is empty
        if (Object.keys(reviews).length === 0) {
          return res.status(200).json({ 
            message: "This book does not have any reviews yet.", 
            reviews: {} 
          });
        }
        // Send the found reviews back to the client
        return res.status(200).json(reviews);
      })
      .catch((err) => {
        // Route tailored error mapping back to the client
        const statusCode = err.status || 500;
        return res.status(statusCode).json({ 
          error: err.message || "Internal Server Error" 
        });
      });
});

module.exports.general = public_users;
