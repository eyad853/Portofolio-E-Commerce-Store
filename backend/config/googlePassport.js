import passport from 'passport';
import User from '../schemas/UserSchema.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from "dotenv"
dotenv.config()

passport.use("google" , new GoogleStrategy(
    {
        clientID:process.env.googleClientID,
        clientSecret:process.env.googleClientSecret,
        callbackURL:process.env.googleCallbackURL
    },
    async (accessToken , refreshToken , profile , done)=>{
       try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);
        const email = profile.emails?.[0]?.value;

        const newUser = new User({
            googleId: profile.id,
            username:  `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
            email,
            avatar: profile.photos?.[0]?.value || null,
            role:email==="eyadmosa853@gmail.com"? "admin":"user",
            adminType:email==="eyadmosa853@gmail.com"? "real":"fake"
        });

        await newUser.save();

        return done(null, newUser); // ✅ Moved here
        } catch (error) {
        return done(error);
        }
    }))

