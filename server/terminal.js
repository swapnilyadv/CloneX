import { WebSocketServer } from "ws"
import pty from "node-pty"

const SHELL = process.env.SHELL || "/bin/zsh"

const wss = new WebSocketServer({ port: 3001 })

console.log("Terminal server running on ws://localhost:3001")
console.log("Using shell:", SHELL)

wss.on("connection", (ws) => {

  let ptyProcess

  try {

    ptyProcess = pty.spawn(SHELL, [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env
    })

  } catch (err) {

    console.error("PTY spawn failed:", err)
    ws.send("Terminal failed to start\n")
    return

  }

  ptyProcess.onData((data) => {
    ws.send(data)
  })

  ws.on("message", (msg) => {
    ptyProcess.write(msg)
  })

  ws.on("close", () => {
    ptyProcess.kill()
  })

})