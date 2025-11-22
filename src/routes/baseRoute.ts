import express, { Router, Request, Response } from 'express'

const router: Router = express.Router()


router.get('/', (req: Request, res:Response ) => {
  res.send(`The server is currently active.`)
})

export default router