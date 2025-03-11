import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../config/stripe";
import { STRIPE_MONTHLY_BASIC_PRICE_ID, STRIPE_WEBHOOK_SECRET_KEY } from "../constants/constant";
import { ApiError } from "../utils/apiError";
import { CREATED, NOTFOUND, BADREQUEST } from "../constants/httpsStatus";
import User from "../models/user.model";
import Subscription from "../models/subscription.model";
import { generateLicenseKey } from "../lib/linensekey";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { NO_USER_FOUND } from "../constants/responseMessage";

// Stripe Webhook Controller
const subscriptionController = 
asyncHandler(
    async (req: Request, res: Response) => {
        console.log("🔥 Incoming Stripe Webhook Request...");
    
        const sig = req.headers["stripe-signature"] as string | undefined;
    
        // ✅ Check for missing signature
        if (!sig) {
            console.error("❌ Missing Stripe signature");
            throw new ApiError(BADREQUEST, "Stripe signature is missing");
        }
    
        let event: Stripe.Event;
    
        try {
            // ✅ Construct the event
            
            event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET_KEY!);
        } catch (error: any) {
            throw new ApiError(BADREQUEST, "Webhook verification failed");
        }
    
        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    const session = await stripe.checkout.sessions.retrieve(
                        (event.data.object as Stripe.Checkout.Session).id,
                        { expand: ["line_items"] }
                    );
    
                    const customerId = session.customer as string;
                    const customerDetails = session.customer_details;
    
                    if (!customerDetails?.email) {
                        throw new ApiError(NOTFOUND,NO_USER_FOUND)
                    }
    
                    // ✅ Find user in DB
                    const user = await User.findOne({ email: customerDetails.email });
                    if (!user) {
                        throw new ApiError(NOTFOUND,NO_USER_FOUND)
                    }
    
                    // ✅ Update Stripe Customer ID
                    if (!user.stripeCustomerId) {
                        await User.updateOne({ _id: user._id }, { $set: { stripeCustomerId: customerId } });
                    }
    
                    const lineItems = session.line_items?.data || [];
    
                    for (const item of lineItems) {
                        const priceId = item.price?.id;
                        const isSubscription = item.price?.type === "recurring";
    
                        if (isSubscription) {
                            let endDate = new Date();
                            const planType = priceId === STRIPE_MONTHLY_BASIC_PRICE_ID ? "basic" : "premium";
    
                            if (priceId === STRIPE_MONTHLY_BASIC_PRICE_ID) {
                                endDate.setMonth(endDate.getMonth() + 1);
                            } 
    
                            // ✅ Create Subscription
                            const newSubscription = await Subscription.create({
                                user: user._id,
                                type: planType,
                                stripeSubscriptionId: session.subscription,
                                priceId: priceId,
                                isActive: true,
                                nextBillingDate: endDate,
                                startDate: new Date(),
                                endDate: endDate,
                                licenseKey: generateLicenseKey(),
                            });

                            if(!newSubscription){
                                throw new ApiError(BADREQUEST,"Subscription not created")
                            }
    
                            // ✅ Update User with Subscription ID
                          const updateUser =   await User.updateOne(
                                { _id: user._id },
                                { $set: { subscription: newSubscription._id } }
                            );

                            if(!updateUser){
                               await newSubscription.deleteOne()
                                throw new ApiError(BADREQUEST,"Subscription not created")


                            }
    
                            console.log(`✅ Subscription created for user ${user.email}`);
                        } else {
                            console.log("🛒 One-time purchase detected (no subscription logic applied)");
                        }
                    }
                    break;
                }
    
                case "invoice.payment_failed": {
                    const invoice = event.data.object as Stripe.Invoice;
                    const customerId = invoice.customer as string;
    
                    const user = await User.findOne({ stripeCustomerId: customerId });
                    if (!user) {
                        console.error("❌ User not found for failed payment");
                        return res.status(NOTFOUND).json({ error: "User not found" });
                    }
    
                    // ✅ Mark Subscription as Inactive
                    await Subscription.updateOne({ user: user._id }, { $set: { isActive: false } });
    
                    console.warn(`⚠️ Payment failed for user: ${user.email}`);
                    break;
                }
    
                case "customer.subscription.deleted": {
                    const subscription = event.data.object as Stripe.Subscription;
                    const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
    
                    if (user) {
                        await User.updateOne({ _id: user._id }, { $set: { subscription: null } });
                        console.log(`🚫 Subscription canceled for user: ${user.email}`);
                    } else {
                        console.error("❌ User not found for subscription cancellation");
                    }
                    break;
                }
    
                default:
                    console.log(`⚠️ Unhandled event type: ${event.type}`);
            }
    
            return res.status(CREATED).json(new ApiResponse(CREATED, "Webhook processed successfully"));
        } catch (error) {
            console.error("❌ Internal Server Error in webhook handling:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
)

export { subscriptionController };
