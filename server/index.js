const PORT = 8001;
const mongoose = require("mongoose");
require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_KEY);
const db = mongoose.connection;
const recipeRoutes = require("./router/recipes-router");

//db stuff
db.once("open", () => {
    console.log("Connected to MongoDB");
});
db.on("error", (err) =>{
    console.log("DB error ", err);
});

//middleware
app.use(express.urlencoded({ extended:true}));
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('Welcome to the Recipe List Server!');
});
app.use("/", require("./router/recipes-router"));  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
module.exports = app;