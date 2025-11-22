import express from "express"
import routes from "./routes/index.js"
import "./models/associations.js"

import { sequelize } from "./sequelize.js"
import Ticket from "./models/Ticket.js"
import { TicketCost, TicketType } from "./enums.js"

const app = express()

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
    return res.sendStatus(200)
  }
  next()
})

app.use(routes)

app.listen(PORT, async () => {
  const shouldAlter = process.env.NODE_ENV === "development"
  await sequelize.sync(shouldAlter ? { alter: true } : undefined)
  await seedTickets()
  console.log(`Server running on port:${PORT}`)
})

async function seedTickets() {
  await Ticket.findOrCreate({
    where: { kind: TicketType.Regular },
    defaults: { kind: TicketType.Regular, price: TicketCost.Regular },
  })
  await Ticket.findOrCreate({
    where: { kind: TicketType.Priority },
    defaults: { kind: TicketType.Priority, price: TicketCost.Priority },
  })
}
