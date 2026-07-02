import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const makeToken=(payload:JwtPayload,secret:string,expires_in:any)=>{
    const token = jwt.sign(payload, secret, { expiresIn:expires_in });
    return token;
}

export const tokenUtils={
    makeToken
}