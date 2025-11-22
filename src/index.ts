import express from "express"
import routes from "./routes/index.js"
import "./models/associations.js"

import { sequelize } from "./sequelize.js"

const app = express()

const PORT = process.env.PORT || 3001

app.use(routes)

app.listen(PORT, async () => {
  await sequelize.sync()
  console.log(`Server running on port:${PORT}`)
})
