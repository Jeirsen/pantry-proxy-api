import express from "express"
import axios from "axios"
import cors from "cors"
import dotenv from "dotenv"
import path from 'node:path';
import { fileURLToPath } from 'url';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const PANTRY_ID = process.env.PANTRY_ID

const PANTRY_BASE_API_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket`

app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/worldfavicon", (req, res) => {
    res.sendFile(path.join(__dirname, "worldfavicon.png"))
})

// Generic handler to GET data about a specific basket
app.get("/:basketName", async (req, res) => {
    const { basketName } = req.params
    try {
        const response = await axios.get(`${PANTRY_BASE_API_URL}/${basketName}`)
        res.json(response.data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Generic handler to POST new data for a specific basket
app.post("/:basketName", async (req, res) => {
    const { basketName } = req.params
    const newData = req.body
    try {
        const response = await axios.post(`${PANTRY_BASE_API_URL}/${basketName}`, {
            newData
        })
        res.json(response.data)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

// Generic handler to PUT data in a specific basket
app.put("/:basketName", async (req, res) => {
    const { basketName } = req.params
    const newData = req.body
    try {
        const response = await axios.put(`${PANTRY_BASE_API_URL}/${basketName}`, {
            newData
        })
        res.json(response.data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Generic handler to DELETE a specific basket
app.delete("/:basketName", async (req, res) => {
    const { basketName } = req.params
    try {
        await axios.delete(`${PANTRY_BASE_API_URL}/${basketName}`)
        res.json({ message: `Basket: ${basketName} cleared successfully.` })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

export default app
