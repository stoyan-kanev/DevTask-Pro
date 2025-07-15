const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");

mongoose.connect('mongodb://admin:strongpassword@10.70.71.118:27017/dev_track_pro?authSource=admin')
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser());

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});


app.use('/users', userRoutes);