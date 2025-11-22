import express, { Router, Request, Response } from 'express'

import { verifyToken } from "../middleware/authMiddleware.js"
import { customRequest } from "../types.js"
import Payment from "../models/Payment.js"
import Booking from "../models/Booking.js"
import User from "../models/User.js"
import { PaymentStatus, BookingStatus } from "../enums.js"
import { sequelize } from "../sequelize.js"

const router: Router = express.Router()

// TODO

// Initiate a payment for a booking belonging to the logged-in user
router.post('/initiate', verifyToken, async (req: Request, res:Response ) => {
  const { bookingId } = req.body ?? {}
  if (typeof bookingId !== "number") {
    return res.status(400).json({ message: "bookingId is required" })
  }

  try {
    const user = await getUserFromRequest(req as customRequest)
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    const booking = await Booking.findOne({ where: { id: bookingId, userId: user.id } })
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    const payment = await Payment.create({
      userId: user.id,
      bookingId: booking.id,
      status: PaymentStatus.Pending,
    })

    res.status(201).json({ paymentId: payment.id, status: payment.status })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Payment initiation failed" })
  }
})

// Verify a payment: simulate delay, mark payment success, flip booking to paid
router.post('/verify', verifyToken, async (req: Request, res:Response ) => {
  const { paymentId } = req.body ?? {}
  if (typeof paymentId !== "number") {
    return res.status(400).json({ message: "paymentId is required" })
  }

  try {
    const user = await getUserFromRequest(req as customRequest)
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    const payment = await Payment.findOne({ where: { id: paymentId, userId: user.id } })
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    if (payment.status === PaymentStatus.Success) {
      return res.status(200).json({ status: PaymentStatus.Success })
    }

    await waitMs(5000)

    await sequelize.transaction(async (t) => {
      await payment.update({ status: PaymentStatus.Success }, { transaction: t })
      const booking = await Booking.findByPk(payment.bookingId, { transaction: t, lock: t.LOCK.UPDATE })
      if (booking) {
        await booking.update({ status: BookingStatus.Paid }, { transaction: t })
      }
    })

    res.status(200).json({ status: PaymentStatus.Success })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Payment verification failed" })
  }
})

export default router

async function getUserFromRequest(req: customRequest) {
  if (!req.userEmail) return null
  return User.findOne({ where: { email: req.userEmail } })
}

function waitMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
