import express, { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'

import User from "../models/User.js"
import RoleModel from "../models/Role.js"
import UserRole from "../models/UserRole.js"
import Booking from "../models/Booking.js"
import Show from "../models/Show.js"
import ShowTicket from "../models/ShowTicket.js"
import Ticket from "../models/Ticket.js"
import { Role, RoleDescription } from '../enums.js'
import { customRequest, ticket } from '../types.js'
import { verifyToken } from "../middleware/authMiddleware.js"
import { ensureAdminOrOwner } from '../util.js'

const router: Router = express.Router()

const roleDescriptionByRole: Record<Role, RoleDescription> = {
  [Role.User]: RoleDescription.User,
  [Role.Admin]: RoleDescription.Admin,
  [Role.Owner]: RoleDescription.Owner,
}

router.post('/createUser', verifyToken, async (req: Request, res:Response ) => {

  const { email, password, role } = req.body ?? {}

  const authOk = await ensureAdminOrOwner(req as customRequest, res)
  if (!authOk) return

  if (typeof email !== "string" || email.trim().length === 0) {
    return res.status(400).json({ message: "Email is required" })
  }
  if (typeof password !== "string" || password.length < 5 || password.length > 32) {
    return res.status(400).json({ message: "Password must be between 5 and 32 characters" })
  }

  const roleValue: Role = Object.values(Role).includes(role) ? role : Role.User

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name: email, email, password: hashedPassword })

    const [roleRecord] = await RoleModel.findOrCreate({
      where: { role: roleValue },
      defaults: { role: roleValue, description: roleDescriptionByRole[roleValue] },
    })

    await UserRole.create({ userId: user.id, roleId: roleRecord.id })

    res.status(201).json({ message: "User successfully created" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "User creation failed" })
  }
})

router.post('/updateUser', verifyToken, async (req: Request, res:Response ) => {
  const { email, role, isEnabled } = req.body ?? {}

  const authOk = await ensureAdminOrOwner(req as customRequest, res)
  if (!authOk) return

  if (typeof email !== "string" || email.trim().length === 0) {
    return res.status(400).json({ message: "Email is required" })
  }
  if (role !== undefined && !Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role" })
  }
  if (isEnabled !== undefined && typeof isEnabled !== "boolean") {
    return res.status(400).json({ message: "isEnabled must be a boolean" })
  }

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    let userRole = await UserRole.findOne({ where: { userId: user.id } })
    if (!userRole) {
      // bootstrap a UserRole if missing
      const [defaultRole] = await RoleModel.findOrCreate({
        where: { role: Role.User },
        defaults: { role: Role.User, description: roleDescriptionByRole[Role.User] },
      })
      userRole = await UserRole.create({ userId: user.id, roleId: defaultRole.id })
    }

    if (role !== undefined) {
      const [newRole] = await RoleModel.findOrCreate({
        where: { role },
        defaults: { role, description: roleDescriptionByRole[role as Role] },
      })
      userRole.roleId = newRole.id
    }

    if (isEnabled !== undefined) {
      if (userRole.isEnabled === isEnabled) {
        return res.status(400).json({ message: "User is already in the requested state" })
      }
      userRole.isEnabled = isEnabled
    }

    await userRole.save()

    res.status(200).json({ message: "User successfully updated" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "User update failed" })
  }
})

router.get('/bookings/:email', verifyToken, async (req: Request, res:Response ) => {
  const targetEmail = req.params.email

  const authOk = await ensureAdminOrOwner(req as customRequest, res)
  if (!authOk) return

  if (typeof targetEmail !== "string" || targetEmail.trim().length === 0) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const user = await User.findOne({ where: { email: targetEmail } })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const bookings = await Booking.findAll({ where: { userId: user.id } })
    return res.status(200).json({ bookings })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch bookings" })
  }
})

// TODO

router.post('/createShow', verifyToken, async (req: Request, res:Response ) => {
  const authOk = await ensureAdminOrOwner(req as customRequest, res)
  if (!authOk) return

 const { name, startTime, endTime, tickets } = req.body ?? {}

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ message: "Invalid name" })
  }

  const start = new Date(startTime)
  const end = new Date(endTime)

  if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
    return res.status(400).json({ message: "Invalid startTime" })
  }
  if (!(end instanceof Date) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid endTime" })
  }
  if (Array.isArray(tickets)) {
    const invalid = tickets.some(
      (t) =>
        typeof t?.ticketId !== "number" ||
        typeof t?.remainingTickets !== "number" ||
        t.remainingTickets < 0
    )
    if (invalid) {
      return res.status(400).json({ message: "Invalid tickets payload" })
    }
  } else if (tickets !== undefined) {
    return res.status(400).json({ message: "tickets must be an array if provided" })
  }

  try {
   const show = await Show.create({ name, startTime: start, endTime: end })

    if (Array.isArray(tickets) && tickets.length > 0) {
      // Optionally verify referenced tickets exist
      const ticketIds = tickets.map((t: ticket) => t.ticketId)
      const foundTickets = await Ticket.findAll({ where: { id: ticketIds } })
      if (foundTickets.length !== tickets.length) {
        return res.status(400).json({ message: "One or more ticketIds are invalid" })
      }

      await Promise.all(
        tickets.map((t: ticket) =>
          ShowTicket.create({
            showId: show.id,
            ticketId: t.ticketId,
            remainingTickets: t.remainingTickets,
          })
        )
      )
    }

    res.status(201).json({ message: "Safari created successfully", showName: show.name })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Safari creation failed" })
  }
})
 
export default router
