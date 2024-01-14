var express = require("express")
var router = express.Router()

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ state: "success", message: "connected" })
})

module.exports = router
