import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { TRequest, TResponse } from "../../utilities/type";
import { sendResponse } from "../../utilities/sendResponse";
import  HttpStatus  from "http-status";
import { premiumService } from "./premium.service";

const getPremiumContent=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
    const result=await premiumService.getPremiumContent()
    sendResponse(res,{
        success:true,
        successStatus:HttpStatus.OK,
        message:"Get premium content",
        data:result
    })
})


export const premiumController={
    getPremiumContent
}