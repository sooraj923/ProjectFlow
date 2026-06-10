const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async(req,res)=>{

    const hashed = await bcrypt.hash(req.body.password,10);

    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashed
    });

    res.json(user);
});

router.post("/login", async(req,res)=>{

    const user = await User.findOne({
        email:req.body.email
    });

    if(!user)
        return res.status(400).json("User Not Found");

    const valid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if(!valid)
        return res.status(400).json("Wrong Password");

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET
    );

    res.json({token});
});

module.exports = router;