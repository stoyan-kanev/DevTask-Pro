const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');

exports.loginUser = (req, res) => {
    // console.log(req.body)


    res.json({
        username: 'username'
    });
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            email,
            password: hash,
        });

        await user.save();

        res.status(201).json({ username, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

