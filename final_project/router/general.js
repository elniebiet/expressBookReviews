const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const jwt = require('jsonwebtoken');

const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
let prGetBooks = new Promise((resolve,reject) => {
setTimeout(() => {
    resolve(JSON.stringify(books,null,4));
},1000)})

public_users.get('/',function (req, res) {
  //Write your code here
  prGetBooks.then((successResponse) => {
    res.send(successResponse);
  })
});

// Get book details based on ISBN
let GetBookWithISBN = (isbn) => {
    let prGetBooksWithISBN = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books[isbn]);
        },1000)})
    return prGetBooksWithISBN;
};

public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  GetBookWithISBN(isbn).then((successResponse) => {
    res.send(successResponse);
  })
 });
  
  
// Get book details based on author
let getBookWithAuthor = (author) => {
    let prGetBooksWithAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const [key, value] of Object.entries(books)) {
    
                if(value.author === author){
                    console.log("found");
                    resolve(value);
                } 
            }
            reject("Not found");
        }, 1000);
    });
    return prGetBooksWithAuthor;
};

public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;

    getBookWithAuthor(author).then((successResponse) => {
        res.send(successResponse);
    })
});

// Get all books based on title
let getBookWithTitle = (title) => {
    let prGetBooksWithTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const [key, value] of Object.entries(books)) {
    
                if(value.title === title){
                    console.log("found");
                    resolve(value);
                } 
            }
            reject(Error("Not found"));
        }, 1000);
    });
    return prGetBooksWithTitle;
};

public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

    getBookWithTitle(title).then((successResponse) => {
        res.send(successResponse);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;

    if(isbn)
    {
        res.send(books[isbn].reviews);
    }
    
    return res.status(300).json({message: "Not found"});
});

module.exports.general = public_users;
