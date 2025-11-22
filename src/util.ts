import { Response } from 'express'

import User from "./models/User.js"
import RoleModel from "./models/Role.js"
import UserRole from "./models/UserRole.js"
import { Role } from './enums.js'
import { customRequest } from './types.js'
import { Includeable } from "sequelize"

export async function ensureAdminOrOwner(req: customRequest, res: Response) {
  const requestingUserEmail = req.userEmail
  if (!requestingUserEmail) {
    res.status(401).json({ message: "Unauthorized" })
    return false
  }

  const user = await User.findOne({ where: { email: requestingUserEmail } })
  if (!user) {
    res.status(401).json({ message: "Unauthorized" })
    return false
  }

  console.log(user.dataValues.email)

  const userRole = await UserRole.findOne({
    where: { userId: user.id },
    include: [{ model: RoleModel, as: "role" } as Includeable],
  })

  const roleValue = (userRole as any)?.role?.role as Role | undefined

  console.log(roleValue)

  if (roleValue !== Role.Admin && roleValue !== Role.Owner) {
    res.status(403).json({ message: "Forbidden" })
    return false
  }

  return true
}
