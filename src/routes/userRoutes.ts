import express, { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from "../models/User.js"
import RoleModel from "../models/Role.js"
import UserRole from "../models/UserRole.js"
import { Role, RoleDescription } from '../enums.js'

const router: Router = express.Router()

// User registration
 router.post('/register', async (req, res) => {
 try {
 const existing = await User.findOne({ where: { email: req.body?.email } })
 if (existing) {
   return res.status(400).json({ message: "Registration failed: User already exists" })
 }
 const { name, email, password } = req.body;
 const hashedPassword = await bcrypt.hash(password, 10);
 const user = await User.create({ name, email, password: hashedPassword });

 // attach default role
 const [role] = await RoleModel.findOrCreate({
   where: { role: Role.User },
   defaults: { role: Role.User, description: RoleDescription.User },
 });
 await UserRole.create({ userId: user.id, roleId: role.id });
 res.status(201).json({ message: 'User registered successfully' });
 } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Registration failed' });
 }
 });

// User login
 router.post('/login', async (req, res) => {

 try {
 const { email, password } = req.body ?? {};
 if (typeof email !== "string" || typeof password !== "string") {
   return res.status(400).json({ error: "Invalid credentials" });
 }
 const user = await User.findOne({where:{email:email}});
 if (!user) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 const passwordMatch = await bcrypt.compare(password, user.password);
 if (!passwordMatch) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 const token = jwt.sign({ userEmail: user.email }, 'your-secret-key', {
 expiresIn: '1h',
 });
 res.status(200).json({ token });
 } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Login failed' });
 }
 });

export default router
