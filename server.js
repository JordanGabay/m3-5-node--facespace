'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')
  
  
  .get('/', (req, res) => {
    res.render('pages/homepage', {users: users});
  })

  .get('/signin', (req, res) => {
    res.render('pages/signin')
  })

  .get('/users/:_id', (req,res) => {
    const {_id} = req.params
    console.log(_id)
    const foundUser = users.find((user) => {
      // console.log(user)
      if(user._id === _id) {
        return true
      }
    })
    let friendsList = foundUser.friends.map(friendId => {
      return users.find((user) => {
        if(user._id === friendId) {
          return true
        }
      })
    })

    const handleName = (req, res) => {
      const firstName = req.body.firstName;
      // console.log(req.body.firstName)
      let foundUser = users.find((user) => {
        return user.name === firstName;
      })
      
      if (foundUser !== undefined) {
        res.status(200).redirect('/users/' + foundUser._id)
      } else {
        res.status(400).redirect('signin');
      }
    }
    
    express()
    .post('/getname', handleName)

  
    
    // console.log(friendsList)
    // console.log(req.params)
    res.render('pages/profile', {user: foundUser, friendsList})
  })


  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
