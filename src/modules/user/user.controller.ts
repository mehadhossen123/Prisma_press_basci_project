import { TRequest, TResponse, TResponseData } from "../../utilities/type";

import HttpStatus from "http-status";

import { userService } from "./user.service";
import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";


const sendResponse=<T>(res:TResponse,data:TResponseData<T>)=>{
  res.status(data.successStatus).json({
    success:data.success,
    successStatus:data.successStatus,
    message:data.message,
    data:data.data,
    meta:data.meta
  })

}


const createUser = catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
  const payload = req.body;
  const user = await userService.createUserIntoDb(payload);


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