const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();
const authRouter = require('./routes/authroutes');
const dotenv = require('dotenv');
const adminRouter = require("./routes/adminroutes");
// const DB = "mongodb+srv://guerrilladev:galaxye5@cluster0.onx7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middlewares
app.use(express.json());

// Routes
app.use(authRouter);
app.use(adminRouter);
dotenv.config();
mongoose.connect(process.env.DB_URL).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log(err));



app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
});

// Continue from 1:32:00