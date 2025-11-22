import express from "express"
import routes from "./routes/index.js"
import "./models/associations.js"

import { sequelize } from "./sequelize.js"

const app = express()

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(PORT, async () => {
  const shouldAlter = process.env.NODE_ENV === "development"
  await sequelize.sync(shouldAlter ? { alter: true } : undefined)
  console.log(`Server running on port:${PORT}`)
})
