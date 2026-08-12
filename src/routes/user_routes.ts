import { Router } from "express";
import { registerUser } from "../controller/auth_controller";

const router = Router();

router.post("/register", registerUser);

export default router;