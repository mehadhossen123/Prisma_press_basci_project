import { Request,Response } from "express"
 
export type TRequest = Request
export type TResponse  = Response


export interface UserPayLoadInterface {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}




 
  export type TMeta = {
  page: number;
  limit: number;
  total: number;
};
  export type TResponseData<T> = {
  success: boolean;
  successStatus: number;
  message: string;
  data: T;
  meta?: TMeta;
};
