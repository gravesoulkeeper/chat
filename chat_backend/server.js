import handleMessage from './routes/msg.js'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import api from './routes/api.js'
import mongoose from 'mongoose'
import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
dotenv.config()

const app = express()
const port = process.env.PORT

// Serve static files from the uploads folder
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//websocket creation
const ip = "http://192.168.0.106:5173"
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', `${ip}`],
        methods: ['GET', 'POST'],
        credentials: true,
    }
})

// Handle socket.io messages
handleMessage(io)

await mongoose.connect(process.env.MONGODB_URL)

app.use(cors({
    origin: ['http://localhost:5173', `${ip}`],
    methods: ['GET', 'POST'],
    credentials: true,
}))
app.use(express.json()) //for req.body
app.use(cookieParser()) //for parsing cookies
app.use(express.urlencoded({ extended: true })) //for req.file and other things
app.use('/api', api)

//Running the server
server.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`)
})