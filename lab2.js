require("dotenv").config()
const express = require("express") //replaces http
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path")
const lab_router = require("./router");

app.use(express.urlencoded({ extended: true }));
app.use("/lab2", lab_router)


app.get("/calculate", (req, res) => {
    console.log(req.params);
    res.send("Enter x or y ");
})
app.use("", (req, res) => {
    res.status(404).send("Page Not Found");
})


app.listen(PORT, () => {
    console.log(`http://127.0.0.1:${PORT}`)
})


