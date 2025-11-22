import express, { Router, Request, Response } from 'express'

const router: Router = express.Router()


router.post('/initiate', (req: Request, res:Response ) => {
  res.send(`Initiated payment`)
})

router.post('/verify', (req: Request, res:Response ) => {
  res.send(`Payment verified`)
})

export default router