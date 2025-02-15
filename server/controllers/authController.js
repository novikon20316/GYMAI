const crypto = require('crypto')
const User = require('../models/User');  // Import User model

const register = async (req, res) => {
    try {
        const {email, username, password,selectedGym} = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        // Call saveClient function to save the new user
        const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');
        const user = new User({email, username, password:hashedPassword,gym:selectedGym});
        await user.save();

        // Respond to the client
        res.status(201).json({success: true, message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash the entered password using SHA-512
        const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');

        // Compare the entered password with the stored hashed password
        if (hashedPassword !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Respond with success (you can later add JWT or session-based login)
        res.status(200).json({ success: true, message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Save new user
const saveClient = async (req, res) => {
    try {
        console.log("Controller in server")
        const { email, username, password,selectedGym } = req.body;
        console.log("email: " + email + ". username: " + username + ". password: " + password + ". gym is: " + selectedGym)
        /*const existingUserEmail = await User.findOne({email});
        const existingUserUserName = await User.findOne({username});
        if (existingUserEmail || existingUserUserName) {
            return res.status(400).json({success:false,message: 'Email or Username already exists'});
        }*/
        const user = new User({ email, username, password,selectedGym });
        await user.save();  // Save user to DB
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({success:false, error: error.message });
    }
};

module.exports = { saveClient, register, login };
