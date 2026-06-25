import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";

const app:Application=express()

app.use(cors({
    origin:config.app_url,
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))



app.get("/",(req:Request,res:Response)=>{
    res.send("this is prisma press project ")
})




export default app;