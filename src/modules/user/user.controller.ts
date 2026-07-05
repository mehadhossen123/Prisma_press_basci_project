import { TRequest, TResponse } from "../../utilities/type";

import HttpStatus from "http-status";

import { userService } from "./user.service";
import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import jwt from "jsonwebtoken"
import config from "../../config";
import { tokenUtils } from "../../utilities/tokenUtils";




//  use catchAsync function  to try catch block 
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

// get my profile function 
const getMyProfile=catchAsync(async(req:TRequest,res:TResponse)=>{
console.log(req.user,"user request")

 const {accessToken}=req.cookies;
const verifyToken=tokenUtils.verifyToken(accessToken,config.jWt_access_secret)
 if( typeof verifyToken=="string"){
  throw new Error (verifyToken)
 }
const profile=await userService.getMyProfile(verifyToken.id)
sendResponse(res,{
  success:true,
  message:"get profile successfully",
  successStatus:HttpStatus.CREATED,
  data:{profile}
})


})




export const userController={
    createUser,
    getMyProfile
}