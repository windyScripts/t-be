import { Request } from "express"
import Show from "./models/Show.js"
import ShowTicket from "./models/ShowTicket.js"
import Ticket from "./models/Ticket.js"

type userPayload = {
    userEmail?: string;
}

export type ticket =  { 
    ticketId: number, 
    remainingTickets: number 
}

export type customRequest = Request & userPayload

export type ShowWithTickets = Show & {
    showTickets: (ShowTicket & { ticket: Ticket | null })[];
}
