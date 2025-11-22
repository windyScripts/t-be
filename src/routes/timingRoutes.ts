import express, { Router, Request, Response } from 'express'
import { Op } from "sequelize"
import Show from "../models/Show.js"
import ShowTicket from "../models/ShowTicket.js"
import Ticket from "../models/Ticket.js"
import { ShowWithTickets } from '../types.js'

const router: Router = express.Router()

// TODO

router.get('/safari-timings', async (req: Request, res:Response ) => {
  const { startTime, endTime, limit = "10", offset, page = "1" } = req.query

  const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 10))
  const parsedPage = Math.max(1, Number(page) || 1)
  const parsedOffset = typeof offset !== "undefined"
    ? Math.max(0, Number(offset) || 0)
    : (parsedPage - 1) * parsedLimit

  const start = startTime ? new Date(String(startTime)) : null
  const end = endTime ? new Date(String(endTime)) : null

  if (!start || Number.isNaN(start.getTime()) || !end || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Valid startTime and endTime are required" })
  }

  try {
    const shows = await Show.findAll({
      where: {
        startTime: { [Op.gte]: start },
        endTime: { [Op.lte]: end },
      },
      include: [
        {
          model: ShowTicket,
          as: "showTickets",
          include: [{ model: Ticket, as: "ticket" }],
        },
      ],
      order: [["startTime", "ASC"]],
      limit: parsedLimit,
      offset: parsedOffset,
    })

    const data = shows.map((show) => {
      const tickets = (show as ShowWithTickets).showTickets?.map((st) => ({
        showTicketId: st.id,
        ticketId: st.ticketId,
        ticketKind: st.ticket?.kind,
        price: st.ticket?.price,
        remainingTickets: st.remainingTickets,
        soldOut: st.remainingTickets <= 0,
      })) || []

      return {
        showId: show.id,
        startTime: show.startTime,
        endTime: show.endTime,
        tickets,
      }
    })

    res.status(200).json({ results: data, limit: parsedLimit, offset: parsedOffset })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch timings" })
  }
})

export default router
