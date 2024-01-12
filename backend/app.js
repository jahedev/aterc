require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const bodyParser = require("body-parser")
const db = require("./db")
const passport = require("./middleware/passport")

const app = express()
db()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err))

// <-   MIDDLEWARES   ->
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/static", express.static(path.join(__dirname, "public")))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())

app.use("/", require("./routes"))
app.use("/auth", require("./routes/auth"))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res
    .status(404)
    .json({ state: "error", message: "Cannot find the resource requested." })
})

module.exports = app
