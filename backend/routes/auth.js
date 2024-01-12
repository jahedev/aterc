require("dotenv").config()
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("../middleware/passport")
const User = require("../db/models/user")
const validateNewUser = require("./auth.validate").validateNewUser

router.post("/signup", validateNewUser, async (req, res, next) => {
  const { username, email, password } = req.body
  try {
    let hashedPassword = await bcrypt.hash(password, 10)
    let user = await User.create({ username, email, password: hashedPassword })
    if (user)
      return res.status(201).json({ state: "success", message: "User created" })
  } catch (err) {
    return res.status(409).json({
      state: "error",
      message: err.message.includes("duplicate key error collection")
        ? "Username or email already exists"
        : "Unable to create new user.",
    })
  }

  return res
    .status(500)
    .json({ state: "error", message: "Internal Server Error" })
})

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body
  if (!(username && password)) {
    return res.status(401).json({
      state: "error",
      message: "Required parameters 'username' and/or 'password' missing.",
    })
  }

  let user

  try {
    user = await User.findOne({ username })
    if (!user)
      return res
        .status(401)
        .json({ state: "error", message: "User does not exist" })
  } catch (err) {
    console.debug(err)
    return res
      .status(500)
      .json({ state: "fatalError", message: "Internal Server Error" })
  }

  const match = await bcrypt.compare(password, user.password)

  if (match) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET)
    return res.json({ state: "success", message: "Login Successful", token })
  }

  return res
    .status(401)
    .json({ state: "error", message: "Invalid Credentials" })
})

router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ state: "success", message: `You are ${req.user.username}` })
  }
)

module.exports = router
