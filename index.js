const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();
const authRouter = require('./routes/auth');
const DB = "mongodb+srv://guerrilladev:galaxye5@cluster0.onx7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use(authRouter);
mongoose.connect(DB).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log(err));

app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
});

// Continue from 1:32:00