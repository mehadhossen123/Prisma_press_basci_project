import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();

router.use("/register", userController.createUser);

export const userRouter = router;
