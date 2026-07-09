import { Router } from "express";
import { profileAuth } from "../user/user.route";
import { subscriptionController } from "./subscription.controller";

const router=Router();
router.post("/checkout",profileAuth(),subscriptionController.createSubscriptionCheckout)



export const subscriptionRouter=router