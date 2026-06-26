import { TRequest, TResponse } from "../../utilities/type";
import { prisma } from "../../lib/prisma";
import HttpStatus from "http-status";

import { userService } from "./user.service";

const createUser = async (req: TRequest, res: TResponse) => {
 try {
     const payload = req.body;
     const user = await userService.createUserIntoDb(payload);
     res.status(HttpStatus.CREATED).json({
       success: true,
       successStatus: HttpStatus.CREATED,
       message: "profile created successfully",
       data: {
         user,
       },
     });
    
 } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
        message:"Failed to user register",
        error:(error as Error).message
    })
    
 }
};

export const userController={
    createUser,
}