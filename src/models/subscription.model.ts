import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  type: 'free' | 'basic' | 'premium';
  maxMessages: number; // Max allowed bulk messages
  stripeSubscriptionId: string; // Stripe subscription ID for payment tracking
  priceId: string; // The price ID from Stripe
  isActive: boolean; // Track if the subscription is active
  nextBillingDate: Date; // Track the next billing date
  licenseKey:string
}
// Function to generate a random license key
const generateLicenseKey = (): string => {
  return (
    Math.random().toString(36).substring(2, 8).toUpperCase() + // First part
    '-' +
    Math.random().toString(36).substring(2, 8).toUpperCase() + // Second part
    '-' +
    Math.random().toString(36).substring(2, 8).toUpperCase()   // Third part
  );
};
const subscriptionSchema: Schema<ISubscription> = new Schema(
  {
    type: { type: String, enum: ['free', 'basic', 'premium'], required: true },
    maxMessages: { type: Number, required: true },
    stripeSubscriptionId: { type: String, required: true },
    priceId: { type: String, required: true },
    licenseKey:{type:String,required:true,default:generateLicenseKey()},
    isActive: { type: Boolean, default: true }, // Active subscription flag
    nextBillingDate: { type: Date, required: true }, // Store next billing date for monthly subscriptions
  },
  { timestamps: true }
);

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
