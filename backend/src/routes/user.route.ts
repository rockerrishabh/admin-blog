import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/users", registerUser);
userRoutes.post("/users/login", loginUser);

export default userRoutes;
