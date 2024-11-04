import { db } from "../db.js"
import { v4 as uuid } from 'uuid'

export const getTasks = (_, res) => {
  const sql = "SELECT * FROM tasks ORDER BY order_tasks ASC"

  db.query(sql, (err, data) => {
    if (err) return res.json(err)

    return res.status(200).json(data)
  })
}

export const addTask = (req, res) => {
  const sql = "INSERT INTO tasks(`id`, `name`, `cost`, `deadline`, `order_tasks`) VALUES(?, ?, ?, ?, ?)"

  const taskId = uuid()

  const values = [
    taskId,
    req.body.name,
    req.body.cost,
    req.body.deadline,
    req.body.order_tasks,
  ]

  db.query(sql, values, (err) => {
    if (err) return res.json(err)
    return res.status(200).json("Tarefa criada com sucesso.")
  })
}

export const updateTask = (req, res) => {
  const sql =
    "UPDATE tasks SET `name` = ?, `cost` = ?, `deadline` = ? WHERE `id` = ?"

  const { name, cost, deadline } = req.body

  const formattedDeadline = (typeof deadline === 'string' && !isNaN(Date.parse(deadline))) 
  ? new Date(deadline).toISOString().split('T')[0] 
  : null

if (!formattedDeadline) {
  throw new Error('Data inválida');
}

  const values = [
    name,
    cost,
    formattedDeadline,
    req.params.id,
  ]

  db.query(sql, values, (err) => {
    if (err) return res.json(err)
    return res.status(200).json("Tarefa atualizada com sucesso.")
  })
}

export const deleteTask = (req, res) => {
  const sql = "DELETE FROM tasks WHERE `id` = ?"

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.json(err)
    return res.status(200).json("Tarefa deletada com sucesso.")
  })
}