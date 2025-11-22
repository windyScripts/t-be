import express, { Router, Request, Response } from 'express'
import { Op } from "sequelize"

import { verifyToken } from "../middleware/authMiddleware.js"
import { customRequest } from "../types.js"
import User from "../models/User.js"
import Booking from "../models/Booking.js"
import ShowTicket from "../models/ShowTicket.js"
import { sequelize } from "../sequelize.js"
import { BookingStatus } from "../enums.js"

const router: Router = express.Router()

// TODO

// List bookings for the logged-in user, with optional date filter and pagination
router.get('/bookings', verifyToken, async (req: Request, res:Response ) => {
  const { startDate, endDate, limit = "20", offset = "0" } = req.query
  const parsedLimit = Math.max(0, Math.min(100, Number(limit) || 20))
  const parsedOffset = Math.max(0, Number(offset) || 0)

  try {
    const user = await getUserFromRequest(req as customRequest)
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    const where: any = { userId: user.id }
    if (startDate || endDate) {
      const start = startDate ? new Date(String(startDate)) : null
      const endD = endDate ? new Date(String(endDate)) : null
      where.createdAt = {}
      if (start && !Number.isNaN(start.getTime())) where.createdAt[Op.gte] = start
      if (endD && !Number.isNaN(endD.getTime())) where.createdAt[Op.lte] = endD
    }

    const bookings = await Booking.findAll({
      where,
      limit: parsedLimit,
      offset: parsedOffset,
      order: [["createdAt", "DESC"]],
    })

    res.status(200).json({ bookings })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch bookings" })
  }
})

// Create a booking for the logged-in user
router.post('/bookings', verifyToken, async (req: Request, res:Response ) => {
  const { id, quantity } = req.body ?? {}

  if (typeof id !== "number" || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid payload" })
  }

  try {
    const user = await getUserFromRequest(req as customRequest)
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    const result = await sequelize.transaction(async (t) => {
      const showTicket = await ShowTicket.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE })
      if (!showTicket) {
        throw { status: 404, message: "ShowTicket not found" }
      }
      if (showTicket.remainingTickets < quantity) {
        throw { status: 400, message: `Only ${showTicket.remainingTickets} tickets left for ${id}` }
      }

      showTicket.remainingTickets = showTicket.remainingTickets - quantity
      await showTicket.save({ transaction: t })

      const booking = await Booking.create(
        {
          userId: user.id,
          showTicketId: id,
          quantity,
          status: BookingStatus.Pending,
        },
        { transaction: t }
      )

      return booking
    })

    res.status(201).json({ message: "Booking created", bookingId: result.id, status: result.status })
  } catch (error: any) {
    if (error?.status && error?.message) {
      return res.status(error.status).json({ message: error.message })
    }
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Booking already exists" })
    }
    console.error(error)
    res.status(500).json({ message: "Booking creation failed" })
  }
})

export default router

async function getUserFromRequest(req: customRequest) {
  if (!req.userEmail) return null
  return User.findOne({ where: { email: req.userEmail } })
}
