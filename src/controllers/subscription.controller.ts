import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Stripe from "stripe";
import stripe from "../config/stripe";
import { STRIPE_MONTHLY_BASIC_PRICE_ID, STRIPE_WEBHOOK_SECRET_KEY } from "../constants/constant";
import { ApiError } from "../utils/apiError";
import { CREATED, NOTALLOWED, NOTFOUND } from "../constants/httpsStatus";
import User from "../models/user.model";
import { CREATED_SUBSCRIPTION, NO_USER_FOUND } from "../constants/responseMessage";
import { generateLicenseKey } from "../lib/linensekey";
import Subscription from "../models/subscription.model";
import { ApiResponse } from "../utils/apiResponse";




const subscriptionController = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body
    const sig = req.headers['stripe-signature']
    let event: Stripe.Event;

    if (sig) {
        event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET_KEY! as string)
    } else {
        throw new ApiError(NOTALLOWED, "webhook verfication failed")
    }



    switch (event.type) {
        case "checkout.session.completed":
            const session = await stripe.checkout.sessions.retrieve((event.data.object as Stripe.Checkout.Session).id
                , {
                    expand: ["line_items"],
                })
            const customerId = session.customer as string;
            const customerDetails = session.customer_details;
            if (customerDetails?.email) {
                const user = await User.findOne({ email: customerDetails.email })

                if (!user) {
                    throw new ApiError(NOTFOUND, NO_USER_FOUND)
                }

                if (!user.stripeCustomerId) {
                    const update = await User.updateOne({ _id: user._id }, { $set: { stripeCustomerId: customerId } })

                    if (!update) {
                        throw new ApiError(406, "user not update")
                    }

                }


                const lineItems = session.line_items?.data || [];

                for (const item of lineItems) {
                    const priceId = item.price?.id;
                    const isSubscription = item.price?.type === "recurring";

                    if (isSubscription) {
                        let endData = new Date();

                        endData.setMonth(endData.getMonth() + 1);
                        const planType = STRIPE_MONTHLY_BASIC_PRICE_ID == priceId ? "basic" : "premium"
                        const newSubscription = await Subscription.create({
                            user: user._id,
                            type: planType,
                            stripeSubscriptionId: session.subscription,
                            priceId: priceId,
                            isActive: true,
                            nextBillingDate: endData,
                            startDate: new Date(),
                            endDate: endData,
                            licenseKey: generateLicenseKey(),
                        });

                        const updateUser = await User.updateOne(
                            { _id: user._id },
                            { $set: { subscription: newSubscription._id } }
                        );

                        if (!updateUser) {
                            throw new ApiError(406, "user not update")
                        }



                    } else {
                        // one_time_purchase
                    }

                }
            }

            break;
        default:
            console.log(`Unable event type ${event.type}`)
    }

    return new ApiResponse(CREATED, CREATED_SUBSCRIPTION)

})


export { 
    subscriptionController
}