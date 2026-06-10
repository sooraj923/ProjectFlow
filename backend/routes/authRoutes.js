const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
try {
const { name, email, password } =
req.body;


if (
  !name ||
  !email ||
  !password
) {
  return res.status(400).json({
    message:
      "All fields are required"
  });
}

if (name.length < 3) {
  return res.status(400).json({
    message:
      "Name must be at least 3 characters"
  });
}

const existingUser =
  await User.findOne({
    email
  });

if (existingUser) {
  return res.status(400).json({
    message:
      "Email already exists"
  });
}

const hashed =
  await bcrypt.hash(
    password,
    10
  );

const user =
  await User.create({
    name,
    email,
    password: hashed
  });

res.status(201).json({
  message:
    "Registration successful"
});


} catch (error) {
console.log(error);


res.status(500).json({
  message:
    "Server Error"
});


}
});

// Login
router.post("/login", async (req, res) => {
try {
const { email, password } =
req.body;


const user =
  await User.findOne({
    email
  });

if (!user) {
  return res.status(400).json({
    message:
      "Invalid email or password"
  });
}

const valid =
  await bcrypt.compare(
    password,
    user.password
  );

if (!valid) {
  return res.status(400).json({
    message:
      "Invalid email or password"
  });
}

const token =
  jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});


} catch (error) {
console.log(error);


res.status(500).json({
  message:
    "Server Error"
});


}
});

module.exports = router;
