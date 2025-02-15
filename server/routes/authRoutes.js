const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log("Auth Controller:", authController); // Debugging line

// Route for registration
router.post('/register', authController.register);

// Route for login
router.post('/login', authController.login);

// Route for login
router.post('/save-client', authController.saveClient);


module.exports = router;
