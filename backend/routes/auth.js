const express = require("express")
const User = require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

const JWT_SCERETE = 'hithisisprasad'

// create a user using :post "/api/auth/createuser" does'not require auth
router.post('/createuser', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid mail").isEmail(),
    body('password', "Password must be atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:success,errors: errors.array() })
    }
    try {
        let user = await User.findOne({email: req.body.email });
        if (user) {
            return res.status(400).json({ success:success,error: "Sorry user with email already registred" })
        }
        
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });
        await user.save();
        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        const authtoken = jwt.sign(data, JWT_SCERETE)
        res.send({ success:success,authtoken: authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error occured")
    }
})

// authenticate a user using :post "/api/auth/login" does'not require auth
router.post('/login', [
    body('email', "Enter a valid mail").isEmail(),
    body('password', "Password cannto be blank").exists()
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ succes:succes,errors: errors.array() })
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({email: req.body.email });
        if (!user) {
            return res.status(400).json({ success:success,error: "Please login with correct credientials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success:success,error: "Please login with correct credientials" })
        }

        const data = {
            user: {
                id: user._id
            }
        }
        success = true
        const authToken = jwt.sign(data, JWT_SCERETE)
         return res.json({success:success, authtoken: authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error occured")
    }
})

// get a user using details:get "/api/auth/getuser" does'not require auth

router.post("/getuser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.status(200).send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error occured")
    }
})
module.exports = router   