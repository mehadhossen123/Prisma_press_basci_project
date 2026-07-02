import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import { TRequest, TResponse } from "../../utilities/type";
import { authService } from "./auth.service";
import  HttpStatus  from "http-status";


const userLogin=catchAsync(async(req:TRequest,res:TResponse)=>{
    const payload=req.body;
    const loginUser=await authService.userLogin(payload);
    sendResponse(res,{
        success:true,
        message:"User login successfully",
        successStatus:HttpStatus.CREATED,
        data:{loginUser}
    })

});



export const  authController={
    userLogin

}