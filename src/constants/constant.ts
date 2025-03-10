export const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none" as "none",
    httpOnly: true,
    secure: true,
};



// Stripe API Keys
const STRIPE_PUBLISH_API_KEY = process.env.STRIPE_PUBLISH_API_KEY;
const STRIPE_SECRET_API_KEY = process.env.STRIPE_SECRET_API_KEY;

// Stripe Plan Links
const STRIPE_MONTHLY_BASIC_PLAN_LINK = process.env.STRIPE_MONTHLY_BASIC_PLAN_LINK;
const STRIPE_MONTHLY_PERMIUM_PLAN_LINK = process.env.STRIPE_MONTHLY_PERMIUM_PLAN_LINK;

// Stripe Price IDs
const STRIPE_MONTHLY_BASIC_PRICE_ID = process.env.STRIPE_MONTHLY_BASIC_PRICE_ID;
const STRIPE_MONTHLY_PERMIUM_PRICE_ID = process.env.STRIPE_MONTHLY_PERMIUM_PRICE_ID;

// Stripe Webhook Secret
const STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET_KEY;

// Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_SECRET_ID = process.env.GOOGLE_SECRET_ID;

// URLs
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

// JWT Secrets
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Database
const DATABASE_URI = process.env.DATABASE_URI;




export { 
    STRIPE_PUBLISH_API_KEY,
    STRIPE_SECRET_API_KEY,
    STRIPE_MONTHLY_BASIC_PLAN_LINK,
    STRIPE_MONTHLY_PERMIUM_PLAN_LINK,
    STRIPE_MONTHLY_BASIC_PRICE_ID,
    STRIPE_MONTHLY_PERMIUM_PRICE_ID,
    STRIPE_WEBHOOK_SECRET_KEY,
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_ID,
    CLIENT_URL,
    SERVER_URL,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
    SESSION_SECRET,
    DATABASE_URI
}


