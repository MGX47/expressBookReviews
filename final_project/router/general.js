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
    const allBooks = books;
    return res.status(200).send(JSON.stringify({allBooks}, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookByIsbn = books[isbn];
    return res.status(200).send(JSON.stringify({bookByIsbn}, null, 4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    return res.status(200).send(JSON.stringify({booksByAuthor}, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    return res.status(200).send(JSON.stringify({booksByTitle}, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookByIsbn = books[isbn]
    if (!bookByIsbn) {
        return res.status(404).send("book not found");
    }
    
    const bookReviews = bookByIsbn.reviews;
    return res.status(200).send(JSON.stringify({bookReviews}, null, 4))
});

module.exports.general = public_users;
