import { TRequest, TResponse } from "../../utilities/type";

import HttpStatus from "http-status";

import { userService } from "./user.service";
import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";




//                 use catchAsync function  to try catch block 
const createUser = catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
  const payload = req.body;
  const user = await userService.createUserIntoDb(payload);

// use reuseable function to send response 
 sendResponse(res,{
  success:true,
  successStatus:HttpStatus.CREATED,
  message:"User created",
  data:{user}

 })
})




export const userController={
    createUser,
}