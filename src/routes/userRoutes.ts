import { Router } from "express";
import { registerUser } from "../controller/userController";
import { validateUserCredentials } from "../util/validators";

const router = Router();

router.post("/register", validateUserCredentials, registerUser);

export default router;
