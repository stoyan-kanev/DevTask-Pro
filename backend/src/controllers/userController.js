const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const RefreshToken = require('../models/RefreshToken');
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
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await RefreshToken.create({token: refreshToken, userId: user._id, expiresAt});
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
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await RefreshToken.create({token: refreshToken, userId: user._id, expiresAt});
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

exports.refreshToken = async (req, res) => {

    const {refresh_cookie} = req.cookies;
    console.log(refresh_cookie);
    let payload;
    try {
        payload = jwt.verify(refresh_cookie, REFRESH_SECRET);
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired refresh token'});
    }
    const storedToken = await RefreshToken.findOne({token: refresh_cookie});
    if (!storedToken || storedToken.expiresAt < Date.now()) {
        return res.status(401).json({message: 'Refresh token expired or not found'});
    }
    const newAccessToken = jwt.sign({id: payload.id}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    res.cookie('auth_cookie', newAccessToken, {httpOnly: true, maxAge: 15 * 60 * 1000, sameSite: 'strict'});
    res.status(200).json({message: 'Access token refreshed'})
}

exports.logoutUser = async (req, res) => {
    const {refresh_cookie} = req.cookies;

    try {
        if (refresh_cookie) {
            await RefreshToken.deleteOne({token: refresh_cookie});
        }

        res.clearCookie('auth_cookie', {sameSite: 'strict', httpOnly: true});
        res.clearCookie('refresh_cookie', {sameSite: 'strict', httpOnly: true});

        res.status(200).json({message: 'Logged out successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Logout failed', error: err.message});
    }
};

exports.authenticate = (req, res, next) => {
    const {auth_cookie} = req.cookies;

    if (!auth_cookie) {
        return res.status(401).json({message: 'Not authenticated'});
    }

    try {
        const decoded = jwt.verify(auth_cookie, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired access token'});
    }
};

exports.me = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
}