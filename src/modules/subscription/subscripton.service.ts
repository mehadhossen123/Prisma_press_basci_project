import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";

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

    // Occurs when a Checkout Session has been successfully completed.
      const paymentIntent = event.data.object;
      console.log(paymentIntent,"deleted event ")
     
      break;
    case "customer.subscription.updated":

    // Occurs whenever a subscription changes (e.g., switching from one plan
    //  to another, or changing the status from trial to active).
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
      case "customer.subscription.deleted":

      // Occurs whenever a customer’s subscription ends.
        

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      break
  }
};



export const subscriptionService={
    createSubscriptionCheckout,
    handleWebhookIntoDb
}