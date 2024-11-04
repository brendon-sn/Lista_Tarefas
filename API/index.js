import express from "express"
import taskRoutes from "./routes/task.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/", taskRoutes)

const PORT = 8800
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})