import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Document } from "mongoose";
import User from "../models/user.model";

dotenv.config();

// Define a TypeScript type for the User model
interface IUser extends Document {
  google_id: string;
  name: string;
  email: string;
  photo: string;
  provider: string;
}

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECERT_ID!,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile: any, done) => {
      try {
        let user = await User.findOne({ google_id: profile.id });

        if (!user) {
          // Create New User if Not Found
          user = new User({
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value || "",
            provider: profile.provider,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Authentication Error:", error);
        return done(error, false); // ❌ FIX: Replaced `null` with `false`
      }
    }
  )
);

// Serialize user
passport.serializeUser((user:any, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || undefined); // ❌ FIX: Changed `null` to `undefined`
  } catch (error) {
    done(error, false); // ❌ FIX: Replaced `null` with `false`
  }
});

export default passport;
