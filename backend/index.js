require("dotenv").config()

const app = require("./app")
const WebSocket = require("ws")
const server = require("http").createServer(app)
const chat = require("./chat")(server)
const { PORT } = process.env

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
