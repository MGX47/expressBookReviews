const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if (users.filter(user => user.username === username).length > 0) {
        return true;
    } 
}

const authenticatedUser = (username, password)=>{ //returns boolean
    if (users.filter((user) => user.username === username && user.password === password).length > 0) {
        return true;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!authenticatedUser(username, password)) {
        return res.status(208).json({ message: "invalid login. check username and password" })
    }

    let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        
        return res.status(200).json({ message: `user ${username} successfully logged in` })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.data;
    const book = books[req.params.isbn];
    const review = req.body.review;

    if (!book) {
        return res.status(404).json({message: "book not found"});
    }
    
    book.reviews[username] = review;
    return res.status(201).json({message: "review updated"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.data;
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({message: "book not found"});
    }
    
    delete book.reviews[username];;
    return res.status(200).json({message: "review deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
