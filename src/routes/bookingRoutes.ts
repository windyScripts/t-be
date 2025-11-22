// get/tickets
// post/tickets (check admin role)

import express, { Router, Request, Response } from 'express'

const router: Router = express.Router()


router.get('/bookings', (req: Request, res:Response ) => {
  res.send(`Get bookings done by user)`)
})

router.get('/bookings/:id', (req: Request, res:Response ) => {
  res.send(`Get bookings where the user is one of the users included`)
})

router.post('/bookings', (req: Request, res:Response ) => {
  res.send(`Create a booking`)
})

export default router