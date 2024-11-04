import express from "express"
import { addTask, deleteTask, getTasks, updateTask } from "../controllers/task.js"

const router = express.Router()

router.get("/", getTasks)
router.post("/", addTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router