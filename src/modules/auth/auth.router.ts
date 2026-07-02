import { Router } from "express";

import { authController } from "./auth.controller";

const router=Router();
router.use("/login",authController.userLogin);
export const   authRouter=router;