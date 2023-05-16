import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/users", registerUser);

export default userRoutes;
