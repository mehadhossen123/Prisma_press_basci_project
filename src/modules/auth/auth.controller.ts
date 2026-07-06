import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import { TRequest, TResponse } from "../../utilities/type";
import { authService } from "./auth.service";
import  HttpStatus  from "http-status";
import { JwtPayload } from "jsonwebtoken";


const userLogin=catchAsync(async(req:TRequest,res:TResponse)=>{
    const payload=req.body;
    const { accessToken, refreshToken } = await authService.userLogin(payload);
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000*60*60*24   // mili second in 1 day 
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // mili second in 1 day
    });
    sendResponse(res, {
      success: true,
      message: "User login successfully",
      successStatus: HttpStatus.CREATED,
      data: { accessToken, refreshToken },
    });

});

// make access token using refresh token 
const refreshToken=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
  const token = req?.cookies?.refreshToken;
  const {accessToken }=await authService.refreshTokenFromDb(token as string) 
   res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "none",
     maxAge: 1000 * 60 * 60 * 24, // mili second in 1 day
   });


  sendResponse(res, {
    success: true,
    message: "Token generated again",
    successStatus: HttpStatus.OK,
    data: {accessToken },
  });

})






export const authController = {
  userLogin,
  refreshToken,
};