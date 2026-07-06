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

export const profileAuth = () => {
  return async (req: TRequest, res: TResponse, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;

    
      if (!accessToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Access token is missing!",
        });
      }

      const verifyToken = tokenUtils.verifyToken(
        accessToken,
        config.jWt_access_secret,
      );

      if (typeof verifyToken === "string") {
        throw new Error(verifyToken);
      }

      const { name, email, role, id } = verifyToken;
      const requiresRole = [Role?.admin, Role?.author, Role?.user];

     
      if (!requiresRole.includes(role)) {
        return res.status(403).json({
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          message: "You don't have permission to access",
        });
      }

      req.user = { id, name, role, email };

      
      next();
    } catch (error) {
     
      next(error);
    }
  };
};

router.post("/register", userController.createUser);
router.get( "/me",profileAuth(),userController.getMyProfile);
router.put("/my-profile",profileAuth(),userController.updateProfile)

export const userRouter = router;
