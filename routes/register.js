const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require('bcrypt');



// Backend route
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      const existingUser = await Users.findOne({
        where: {
          gmail: email
        }
      });
  //
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create a new user
      const newUser = await Users.create({
        userName: username,
        gmail: email,
        password: hashedPassword
      });

      req.session.username = newUser.userName;
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });


  router.get('/:userName', async (req, res) => {
    const userName = req.params.userName; // Get the username from request params
    
    try {
      // Find user by username
      const user = await Users.findOne({
        where: {
          username: userName
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ message: 'Error retrieving user' });
    }
});

module.exports = router;

  