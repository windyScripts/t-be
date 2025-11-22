import express, { Router } from 'express'

import userRouter from './userRoutes.js'
import baseRouter from './baseRoute.js'
import bookingsRouter from './bookingRoutes.js'
import timingRouter from './timingRoutes.js'
import paymentRouter from './paymentRoutes.js'
import adminRouter from './adminRoutes.js'

const router:Router = express.Router();

router.use("/", userRouter);
router.use("/", baseRouter);
router.use("/", bookingsRouter);
router.use("/", timingRouter);
router.use("/payments", paymentRouter);
router.use("/admin", adminRouter);



export default router;

