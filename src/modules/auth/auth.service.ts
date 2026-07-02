import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
 import jwt, { SignOptions } from "jsonwebtoken"
import config from "../../config";
import { tokenUtils } from "../../utilities/tokenUtils";

const userLogin =async(payload:any)=>{
    const {email,password}=payload;
 const user=await prisma.user.findUniqueOrThrow({
    where:{email}
   
 })

 const isMatchPassword=await bcrypt.compare(password,user.password);
 if(!isMatchPassword){
    throw new Error("Password doesn't match");
 }
 const accessPayload={
    id:user.id,
    name:user.name,
    email:user.email,

 }
 const accessToken=tokenUtils.makeToken(accessPayload,config.jWt_access_secret,config.jWt_access_expires_in)
 const refreshToken=tokenUtils.makeToken(accessPayload,config.jwt_refresh_secret,config.jwt_refresh_expires_in )

  return {
    accessToken,
    refreshToken
  }

};


export const authService={
    userLogin
}