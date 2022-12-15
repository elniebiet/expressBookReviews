const express = require('express');
const { Session } = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    if(username)
        return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    console.log("attempted");
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let username = req.session.authorization.username;
    const isbn = req.params.isbn;
    
    if(isbn)
    {
        if(books[isbn].reviews)
        {
            books[isbn].reviews[username] = req.body.review;
            res.send("Review Updated!\n\n\n" + JSON.stringify(books,null,4)); 
        }
    }

    res.send("review not updated!");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    
      let username = req.session.authorization.username;
      const isbn = req.params.isbn;
      
      if(isbn)
      {
          if(books[isbn].reviews)
          {
            delete books[isbn].reviews[username];
            res.send("Review Deleted!\n\n\n" + JSON.stringify(books,null,4)); 
          }
      }
  
      res.send("review not deleted!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
