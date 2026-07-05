import { NextFunction, Router } from "express";
import { userController } from "./user.controller";
import { TRequest, TResponse } from "../../utilities/type";
import { tokenUtils } from "../../utilities/tokenUtils";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import HttpStatus from "http-status";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

router.use("/register", userController.createUser);
router.use(
  "/me",
  (req: TRequest, res: TResponse, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const verifyToken = tokenUtils.verifyToken(
      accessToken,
      config.jWt_access_secret,
    );
    if (typeof verifyToken == "string") {
      throw new Error(verifyToken);
    }
    const { name, email, role, id } = verifyToken;
   

    const requiresRole = [Role?.admin, Role?.author, Role?.user];
    // check if the role is matched
    if (!requiresRole.includes(role)) {
      res.status(403).json({
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: "You don't have any  permission to access",
      });
    }
    req.user = {
      id,
      name,
      role,
      email,
    };

    next();
  },

  userController.getMyProfile,
);

export const userRouter = router;
