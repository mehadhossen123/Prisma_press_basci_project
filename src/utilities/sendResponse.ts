import { TResponse, TResponseData } from "./type"

 export const sendResponse=<T>(res:TResponse,data:TResponseData<T>)=>{
  res.status(data.successStatus).json({
    success:data.success,
    successStatus:data.successStatus,
    message:data.message,
    data:data.data,
    meta:data.meta
  })

}