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



export const subscriptionService={
    createSubscriptionCheckout
}