
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import { subscriptionStatus } from "../../../generated/prisma/enums";
import e from "express";

const createSubscriptionCheckout=async(userId:string)=>{

    const transactionResult=await prisma.$transaction(
        async(tx)=>{

         const user=await tx.user.findUniqueOrThrow({
            where:{id:userId},
            include:{
                subscription:true
            }
         })
         

        // create stripe customer id 

         let stripeCustomerId = user.subscription?.stripeCustomerId;
         if(!stripeCustomerId){
            const customer = await stripe.customers.create({
              name: user.name,
              email: user.email,
              metadata: { userId: user.id },
            });

            stripeCustomerId=customer.id;
         }

        //  create stripe checkout session
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: config.stripe_product_id,
              quantity: 1,
            },
          ],
          mode: "subscription",
          customer: stripeCustomerId,
          payment_method_types: ["card"],
          success_url: `${config.app_url}/premium?success=true`,
          cancel_url: `${config.app_url}/payment?success=false`,
          metadata: { userId: user.id },
        });
        return session.url;

        




        }
    )

    return transactionResult;

}


const handleWebhookIntoDb = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handleSubscriptionEventComplete(event.data.object)

    
     
      break;
    case "customer.subscription.updated":

    // Occurs whenever a subscription changes (e.g., switching from one plan

    await handleSubscriptionUpdated(event.data.object)
   
      break;
      case "customer.subscription.deleted":

      // Occurs whenever a customer’s subscription ends.
        await handleSubscriptionUpdated(event.data.object);
   
        

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      break
  }
};



const getPeriodTime=(payload:Stripe.Subscription)=>{
  const currentPeriodEndInMilliSeconds =
   payload.items.data[0]?.current_period_end!;
  const currentPeriodEnd = new Date(currentPeriodEndInMilliSeconds * 1000);


  return currentPeriodEnd
}

// handle checkout.session.completed event 
const handleSubscriptionEventComplete = async(session:Stripe.Checkout.Session) => {
  // Occurs when a Checkout Session has been successfully completed.
 
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error("Webhook failed");
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);
    // get period time form a function 
   const currentPeriodEnd=getPeriodTime(stripeSubscription)

  

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};


// customer.subscription.updated
const handleSubscriptionUpdated=async(payload:Stripe.Subscription)=>{
  const subscriptionId=payload.id;
  const status=payload.status=="active"?subscriptionStatus.ACTIVE:
  payload.status=="trialing"?subscriptionStatus.ACTIVE:
  payload.status=="canceled"?subscriptionStatus.CANCELLED:subscriptionStatus.EXPIRED

  const currentPeriodTime=getPeriodTime(payload)

  const isExistSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if(!isExistSubscription){
    console.log(`Webhook : there is no subscription on this id : ${subscriptionId}`)
    return;
  }

  await prisma.subscription.update({
    where:{stripeSubscriptionId:subscriptionId},
    data:{
      status:status,
      currentPeriodEnd:currentPeriodTime
    }
  })

}





export const subscriptionService={
    createSubscriptionCheckout,
    handleWebhookIntoDb
}