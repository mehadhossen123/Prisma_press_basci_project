import express, { Application, request, Request, response, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.router";
import { postRouter } from "./modules/post/post.router";
import { commentRouter } from "./modules/comment/comment.router";



const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("this is prisma press project ");
});

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter)
app.use("/api/post",postRouter)
app.use("/api/comment",commentRouter)

app.use((req:Request ,res:Response)=>{
  res.status(404).json({
    message:"Route not found ",
    path:req.originalUrl,
  })
})

export default app;
