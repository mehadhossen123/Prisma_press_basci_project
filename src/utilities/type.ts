import { Request,Response } from "express"
 
export type TRequest = Request
export type TResponse  = Response


export interface UserPayLoadInterface {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}