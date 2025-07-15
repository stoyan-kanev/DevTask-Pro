const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = 'access_token_secret';
const REFRESH_SECRET = 'refresh_secret_token'

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {

            const accessToken = jwt.sign({id: user._id}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
            const refreshToken = jwt.sign({id: user._id}, REFRESH_SECRET, {expiresIn: '7d'});

            res.cookie('auth_cookie', accessToken, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict'
            })
            res.cookie('refresh_cookie', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict'
            })
            return res.status(200).json({message: "Logged in successfully"});
        } else {
            res.status(401).json({message: 'Wrong password'})

        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to login', error: err});
    }


}

exports.registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({message: 'User already exists'});
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            email,
            password: hash,
        });

        await user.save();

        const accessToken = jwt.sign({id: user._id}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign({id: user._id}, REFRESH_SECRET, {expiresIn: '7d'});

        res.cookie('auth_cookie', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        })
        res.cookie('refresh_cookie', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        })

        res.status(201).json({username, email});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

