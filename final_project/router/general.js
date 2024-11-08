const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "unable to register"});
    }
    if (isValid(username)) {
        return res.status(404).json({message: "username already taken"});
    }

    users.push({username: username, password: password});
    return res.status(201).json({message: `user ${username} registered successfully`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const allBooks = new Promise((resolve,reject) => {
        resolve(books);
    });
    allBooks.then((result) => {
        return res.status(200).send(JSON.stringify({result}, null, 4))
    }).catch(() => {
        return res.status(500).json({message: "server error"});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookByIsbn = new Promise((resolve,reject) => {
        resolve(books[isbn]);
    });
    bookByIsbn.then((result) => {
        return res.status(200).send(JSON.stringify({result}, null, 4))
    }).catch(() => {
        return res.status(500).json({message: "server error"});
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = new Promise((resolve,reject) => {
        resolve(Object.values(books).filter(book => book.author === author));
    });
    booksByAuthor.then((result) => {
        return res.status(200).send(JSON.stringify({result}, null, 4))
    }).catch(() => {
        return res.status(500).json({message: "server error"});
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = new Promise((resolve,reject) => {
        resolve(Object.values(books).filter(book => book.title === title));
    });
    booksByTitle.then((result) => {
        return res.status(200).send(JSON.stringify({result}, null, 4))
    }).catch(() => {
        return res.status(500).json({message: "server error"});
    })
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookByIsbn = books[isbn]
    if (!bookByIsbn) {
        return res.status(404).json({message: "book not found"});
    }
    
    const bookReviews = bookByIsbn.reviews;
    return res.status(200).send(JSON.stringify({bookReviews}, null, 4))
});

module.exports.general = public_users;
