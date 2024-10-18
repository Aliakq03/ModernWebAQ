const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.send("welcome to lab 2");
});
router.get("/name", (req, res) => {
    res.send("Alia Qureshi");
});
router.get("/greeting", (req, res) => {
    res.send("Hello! This is Alia Qureshi coming through the screen! My student number is N01488776");
})
router.get("/add/:a/:b", (req, res) => {
    console.log(req.params);
    let a = parseFloat(req.params.a)
    let b = parseFloat(req.params.b)
    res.send(JSON.stringify(a + b));
})
router.get("/calculate/:x/:y/:op", (req, res) => {
    let x = parseFloat(req.params.x)
    let y = parseFloat(req.params.y)
    let op = req.params.op;

    switch (op) {
        case "+":
            res.send(JSON.stringify(x + y))
            break;
        case "-":
            res.send(JSON.stringify(x - y))
        case "*":
            res.send(JSON.stringify(x * y))
        case "%":
            res.send(JSON.stringify(x / y))
        case "**":
            res.send(JSON.stringify(x ** y))

        default:
            break;
    }
})
module.exports = router