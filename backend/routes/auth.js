const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require("bcryptjs");
const fetchuser = require("../middleware/fetchuser");
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Create a user using; POST "/api/auth/createuser" . No login required
const jwt_secret = "Harryisbdab4oy"

router.post('/createuser', [
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {
    let success = false
    // if there are errors return bad request with error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    try {
        // checks whether the user with this email already exists
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "please enter valid credentials" })

        }

        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashpass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_secret);
        success = true
        // res.json(user)
        res.json({ success, authToken })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")
    }

})

// Create a user using; POST "/api/auth/login" . No login required

router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password not ve blank').exists(),
], async (req, res) => {
    let success = false
    // if there are errors return bad request with error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "please enter valid credentials" })

        }

        const pass = await bcrypt.compare(password, user.password)
        if (!pass) {
            success = false
            return res.status(400).json({ success, error: "please enter valid credentials" })

        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_secret)
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")

    }

})

// Get loggedIn user detail ; POST "/api/auth/getdetail" .  login required

router.post('/getdetail', fetchuser, async (req, res) => {

    try {
        const userid = req.user.id
        const user = await User.findById(userid).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }
})
module.exports = router


// forgot-password , send reset token


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, jwt_secret, { expiresIn: '1h' });

        // ✉️ Nodemailer config
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `
                <h3>Reset Password</h3>
                <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Reset link sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});








// Reset password using Token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, jwt_secret);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, error: "Invalid or expired token" });
    }
});





