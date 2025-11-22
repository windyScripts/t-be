import express, { Router, Request, Response } from 'express'

const router: Router = express.Router()


router.get('/', (req: Request, res:Response ) => {
  res.send(`Hey, the server is running! :)`)
})

export default router