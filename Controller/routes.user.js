const express = require('express');
const userModel = require("../Model/model.user");
const authMiddleware = require("../Middleware/middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRoutes = express.Router();

userRoutes.get("/sign-in", (req, res) => {
    res.render("sign-in");
})

userRoutes.get("/login", (req, res) => {
    res.render("login");
})

userRoutes.get("/", authMiddleware, (req, res) => {
    res.render("home");
});

userRoutes.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fileds are required" });
        }
        const hashPassword = await bcrypt.hash(password, 8);
        const user = await new userModel({ name, email, password: hashPassword });
        await user.save();
        res.render("login");
    } catch (error) {
        console.log("User not added ", error);
    }
})

userRoutes.post("/loginData", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" })
        }
        const checkuser = await userModel.findOne({ email });
        if (!checkuser) {
            return res.status(404).json({ msg: "User not found" });
        }
        const passMatch = await bcrypt.compare(password, checkuser.password);
        if (!passMatch) {
            return res.status(401).json({ msg: "Password not match" });
        }
        const token = jwt.sign({ userId: checkuser._id }, 'node', { expiresIn: '1h' });

        res.cookie("token", token, { httpOnly: true, secure: true });
        res.redirect("/");
    } catch (error) {
        console.log("User not found. ", error);
    }
})

module.exports = userRoutes;