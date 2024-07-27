const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require('bcrypt');

// GET all users
router.get("/", async (req, res) => {
    try {
        const listOfUsers = await Users.findAll();
        res.json(listOfUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});


router.get("/:userName", async (req, res) => {
    try {
        const { userName } = req.params;
        const user = await Users.findOne({
            where: {
                userName: userName // Matching userName from the URL params with the userName in the database
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// POST create a new user
//router.post("/", async (req, res) => {
//    const { userName, gmail, password } = req.body;
//    try {
//        console.log("Received login request:", req.body);
//        const user = await Users.findOne({
//            where: {
//                gmail: gmail 
//            }
//        });
//
//        if (!user) {
//            return res.status(400).json({ message: 'User not found' });
//        }
//
//        const match = await bcrypt.compare(password, user.password);
//        
//        if (!match) {
//            return res.status(400).json({ message: 'Incorrect password' });
//        }
//    
//        req.session.username = user.userName;
//        console.log("Session username is>>>", user.userName);
//
//        res.status(200).json({ message: 'Login successful', user });
//    } catch (error) {
//        console.error("Error logging in user:", error);
//        res.status(500).json({ error: "Failed to log in user" });
//    }
//});
router.post("/", async (req, res) => {
    const { userName, password } = req.body; // Ensure this matches the frontend
    try {
      console.log("Received login request:", req.body);
      
      const user = await Users.findOne({
        where: {
          userName: userName // Ensure this matches the field in the database
        }
      });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      if(user) {
        
      }
  
      const match = await bcrypt.compare(password, user.password);
      
      
      if (!match) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
      if(match) {
        console.log('ive found the mach');
      }
  
      req.session.username = user.userName;
      console.log("Session username is>>>", user.userName);
  
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Failed to log in user" });
    }
  });
  

module.exports = router;
