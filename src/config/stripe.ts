import Stripe from 'stripe';
import { STRIPE_SECRET_API_KEY } from '../constants/constant';

// Initialize Stripe with your secret key
console.log(process.env.STRIPE_SECRET_API_KEY,"secert");

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY! as string, {
    apiVersion:"2025-02-24.acacia",
    typescript:true
});

export default stripe;