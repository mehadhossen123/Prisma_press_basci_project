import express, { Application, request, Request, response, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.router";
import { postRouter } from "./modules/post/post.router";
import { commentRouter } from "./modules/comment/comment.router";
import { subscriptionRouter } from "./modules/subscription/subscription.router";
import { stripe } from "./lib/stripe";



const app: Application = express();
// setup cors error 

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
// end point secret 
const endpointSecret=config.stripe_webhook_secret

// here setup stripe webhook 
app.post("/api/subscription/webhook",express.raw({type: 'application/json'}),
(request,response)=>{

  let event = request.body;
  console.log(event,"stripe request body")
  console.log(request.headers,"stripe request headers")
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"]!;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret,
      );
    } catch (err:any) {
      
      return response.status(400).json({
        message:err.message
      });
    }
  }
  console.log(event,"event after try block")

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
})

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
app.use("/api/subscription",subscriptionRouter)

app.use((req:Request ,res:Response)=>{
  res.status(404).json({
    message:"Route not found ",
    path:req.originalUrl,
  })
})

export default app;
