const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    
    // Return true if a match is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 1. Check if both username and password are provided in the request body
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. Username and password are required." });
    }

    // 2. Authenticate the user against the records
    if (authenticatedUser(username, password)) {
        
        // 3. Generate a JWT token for the session
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 }); // Token expires in 1 hour

        // 4. Save the token and username to the session authorization object
        req.session.authorization = {
            accessToken, username
        }
        
        return res.status(200).send("User " + username + " successfully logged in");
    } else {
        // Return error if credentials do not match
        return res.status(208).json({ message: "Invalid Login. Check username and password." });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    // Extract the username from the active session
    const username = req.session.authorization['username'];

    // 1. Check if the book exists in the database
    if (books[isbn]) {
        
        // 2. Check if this specific user has actually posted a review for this book
        if (books[isbn].reviews[username]) {
            
            // 3. Delete only this user's review
            delete books[isbn].reviews[username];
            
            return res.status(200).send(`The review by user ${username} for book ISBN ${isbn} has been deleted successfully.`);
        } else {
            // If the user hasn't reviewed the book, return an error
            return res.status(404).json({ message: "Review not found for this user." });
        }
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    
    // Extract the username from the session (set during login)
    const username = req.session.authorization['username'];

    // 1. Check if the review query parameter was provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required as a query parameter." });
    }

    // 2. Check if the book exists in the database
    if (books[isbn]) {
        // 3. Add or update the review
        // By using the username as the key, it will create a new entry if the user hasn't 
        // reviewed it yet, or overwrite their old review if they have.
        books[isbn].reviews[username] = review;
        
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated successfully.`);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
