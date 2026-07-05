import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const makeToken=(payload:JwtPayload,secret:string,expires_in:any)=>{
    const token = jwt.sign(payload, secret, { expiresIn:expires_in });
    return token;
}


// verify token 
const verifyToken=(token:any,secret:any)=>{
   try {
     const verifyToken = jwt.verify(token, secret);
     return verifyToken;
    
   } catch (error:any) {
    throw new Error (error.message)
    
   }
}

export const tokenUtils={
    makeToken,
    verifyToken
}