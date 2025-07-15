const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                return res.status(200).json({message: "Logged in successfully"});
            }
            else{
                res.status(401).json({message: 'Wrong password'})
            }
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

        res.status(201).json({username, email});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error', error: err.message});
    }
}

