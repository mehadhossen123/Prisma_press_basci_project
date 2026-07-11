import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { TRequest, TResponse } from "../../utilities/type";
import { subscriptionService } from "./subscripton.service";
import { sendResponse } from "../../utilities/sendResponse";
import HttpStatus from "http-status";

const createSubscriptionCheckout=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
    const userId=req.user?.id;
    const result=await subscriptionService.createSubscriptionCheckout(userId as string);
    sendResponse(res,{
        success:true,
        successStatus:HttpStatus.OK,
        message:"checkout completed successfully",
        data:result
    })

})


const handleWebhook=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
    const event=req.body as Buffer;
    const signature=req?.headers["stripe-signature"]
   await subscriptionService.handleWebhookIntoDb(event ,signature as string)

    sendResponse(res,{
        success:true,
        successStatus:HttpStatus.OK,
        message:"Webhook triggered successfully",
        data:null
    })

})
const getSubscriptionStatus=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
    const userId=req?.user?.id;
    const result=await subscriptionService.getSubscriptionStatus(userId as string)
    sendResponse(res,{
        success:true,
        successStatus:HttpStatus.OK,
        message:"Subscription status get successfully",
        data:result
    })

})


export const subscriptionController = {
  createSubscriptionCheckout,
  handleWebhook,
  getSubscriptionStatus,
};