import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { TRequest, TResponse } from "./utilities/type";
import HttpStatus from "http-status";
import bcrypt from "bcrypt"



const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("this is prisma press project ");
});

app.post("/api/user/register", async (req: TRequest, res: TResponse) => {
  const {name,email,password,profilePhoto} = req.body;
//   user exist in the database ? 
const userExist=await prisma.user.findUnique({
    where:{
        email
    }
})

if(userExist){
    throw new Error("User already exist in this email")
}
const hashedPassword=await bcrypt.hash(password,Number(config.bcrypt_salt_rounds));
const CreatedUser=await prisma.user.create(
    {
        data:{
            name,
            email,
            password:hashedPassword

        }
    }
)

await prisma.profile.create({
    data:{
        userId:CreatedUser.id,
        profilePhoto

    }
})


const user=await prisma.user.findUnique({
    where:{
        id:CreatedUser.id,
        email:CreatedUser.email
    },
    omit:{
        password:true
    },
    include:{
        profile:true
    }
})


res.status(HttpStatus.CREATED).json({
    success:true,
    successStatus:HttpStatus.CREATED,
    message:"profile created successfully",
    data:{
        user
    }
})




 
});

export default app;
