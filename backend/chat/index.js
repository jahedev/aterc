const WebSocket = require("ws")
const jwt = require("jsonwebtoken")
const User = require("../db/models/user")
function chat(server) {
  const wss = new WebSocket.Server({ server })

  wss.on("connection", (ws, req) => {
    console.log("Client connected")

    function unauthorizedDisconnect() {
      ws.send("Error: Your token is no longer valid. Please reauthenticate.")
      ws.close()
    }

    const { authorization } = req.headers
    const token =
      authorization && authorization.includes("bearer ")
        ? authorization.split(" ")[1]
        : ""

    let email

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          unauthorizedDisconnect()
        }

        email = decoded.email
      })
    } else {
      unauthorizedDisconnect()
    }

    ws.on("message", (data) => {
      let parsed
      try {
        parsed = JSON.parse(data.toString())
      } catch (err) {
        return ws.send(
          JSON.stringify({ state: "error", message: "Invalid JSON Data" })
        )
      }
      if (parsed?.sender != email) {
        return ws.send(
          JSON.stringify({ state: "error", message: "Unexpected sender" })
        )
      }
      
    })

    ws.on("close", () => {
      console.log("Client disconnected")
    })
  })

  return wss
}

module.exports = chat
