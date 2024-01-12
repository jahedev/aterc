const validator = require("validator")

const validateNewUser = (req, res, next) => {
  const { username, email, password } = req.body

  if (!(username && email && password)) {
    return res.status(401).json({
      state: "error",
      message:
        "Required parameters 'username', 'email', and/or 'password' missing.",
    })
  } else if (!validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
    return res.status(401).json({
      state: "error",
      message:
        "Username must only contain letters, numbers, periods, or hyphens",
    })
  } else if (!validator.isEmail(email)) {
    return res.status(401).json({
      state: "error",
      message: "Email is invalid",
    })
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 1,
      pointsForContainingLower: 100,
      pointsForContainingUpper: 100,
      pointsForContainingNumber: 100,
      pointsForContainingSymbol: 0,
    })
  ) {
    return res.status(401).json({
      state: "error",
      message: "Password must be at least 8 characters with at least 1 number.",
    })
  }
  next()
}

module.exports = {
  validateNewUser
}