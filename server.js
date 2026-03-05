import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import http from 'http'
import pty from 'node-pty'
import { WebSocketServer } from 'ws'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

// Simple build endpoint (keeps previous sample behavior but you have /api/build-project with template support earlier)
app.post('/api/build-project', async (req, res) => {
  const { prompt } = req.body
  try {
    // simple placeholder generator if OpenAI not configured
    if (!openai) {
      const files = [
        {
          name: 'index.html',
          content: `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
            `<script src="https://cdn.tailwindcss.com"></script><title>Clonex</title></head><body class="bg-slate-900 text-white"><div class="max-w-4xl mx-auto py-20 text-center">` +
            `<h1 class="text-4xl font-bold">${String(prompt || 'Clonex Project')}</h1></div></body></html>`
        },
        { name: 'index.css', content: '/* empty */' }
      ]
      return res.json({ files })
    }

    // call AI (best-effort usage; adapt for your SDK)
    const ai = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Generate a JSON object { files: [{name, content}] for a small web app based on the prompt' } ,
        { role: 'user', content: String(prompt) }
      ],
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    })

    let result = ai.choices?.[0]?.message?.content
    if (typeof result === 'string') {
      try { result = JSON.parse(result) } catch (e) { /* fallback below */ }
    }

    if (!result || !result.files) {
      // fallback simple files
      return res.json({ files: [ { name: 'index.html', content: '<html><body><h1>Empty</h1></body></html>' } ] })
    }

    res.json(result)
  } catch (err) {
    console.error('build-project error', err)
    res.status(500).json({ error: err.message || String(err) })
  }
})

// AI editing endpoint
app.post('/api/ai-edit', async (req, res) => {
  const { prompt, files, model } = req.body
  if (!prompt || !files) return res.status(400).json({ error: 'missing prompt or files' })
  try {
    if (!openai) throw new Error('OpenAI API Key not configured')

    const EDIT_SYSTEM = `You are an expert software engineer. You receive project files and a user instruction. Return updated files in JSON format exactly as: {files:[{name:string,content:string}]}`
    const userMessage = `INSTRUCTION:\n${prompt}\n\nFILES:\n${JSON.stringify(files)}`

    const response = await openai.chat.completions.create({
      model: (model || 'gpt-4o').toLowerCase().includes('gpt') ? 'gpt-4o' : 'gpt-4o',
      messages: [ { role: 'system', content: EDIT_SYSTEM }, { role: 'user', content: userMessage } ],
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    })

    let result = response.choices?.[0]?.message?.content
    if (typeof result === 'string') {
      try { result = JSON.parse(result) } catch (e) {
        const match = String(result).match(/\{[\s\S]*\}/)
        if (match) result = JSON.parse(match[0])
        else throw e
      }
    }

    return res.json(result)
  } catch (err) {
    console.error('ai-edit error', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// create HTTP server and attach WebSocket terminal
const server = http.createServer(app)

const wss = new WebSocketServer({ server, path: '/api/terminal' })

wss.on('connection', (ws) => {
  const shell = process.platform === 'win32' ? 'powershell.exe' : process.env.SHELL || 'bash'
  const cols = 80
  const rows = 24
  const ptyProcess = pty.spawn(shell, [], { name: 'xterm-color', cols, rows, cwd: process.cwd(), env: process.env })

  const send = (payload) => { try { ws.send(JSON.stringify(payload)) } catch (e) {} }

  ptyProcess.on('data', (d) => send({ type: 'output', data: d }))

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (msg.type === 'input') ptyProcess.write(msg.data)
      else if (msg.type === 'resize') ptyProcess.resize(msg.cols || cols, msg.rows || rows)
    } catch (e) {
      ptyProcess.write(raw.toString())
    }
  })

  ws.on('close', () => { try { ptyProcess.kill() } catch (e) {} })
})

server.listen(PORT, () => console.log(`Clonex Backend running on port ${PORT}`))
