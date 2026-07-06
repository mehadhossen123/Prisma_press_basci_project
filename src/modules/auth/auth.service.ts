import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
 import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config";
import { tokenUtils } from "../../utilities/tokenUtils";




//user login done here form data base 
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
    role:user.role

 }
 const accessToken=tokenUtils.makeToken(accessPayload,config.jWt_access_secret,config.jWt_access_expires_in)
 const refreshToken=tokenUtils.makeToken(accessPayload,config.jwt_refresh_secret,config.jwt_refresh_expires_in )

  return {
    accessToken,
    refreshToken
  }

};

// make access token using refresh token 

const refreshTokenFromDb=async(token :string)=>{
   const verifiedToken=tokenUtils.verifyToken(token,config.jwt_refresh_secret )
   if(!verifiedToken){
      throw new Error("Refresh token are not valid")
   }

   const {id}=verifiedToken as JwtPayload;

   const user=await prisma.user.findFirstOrThrow({
      where:{id}
   })

   if(user.activeStatus=="blocked"){
      throw new Error("Account is blocked")
   }

   const payload={
      id,
      name:user?.name,
      email:user?.email,
      role:user?.role
   }

   const accessToken=tokenUtils.makeToken(payload,config.jWt_access_secret,config.jWt_access_expires_in)
   return {accessToken}



}


export const authService = {
  userLogin,
  refreshTokenFromDb,
};