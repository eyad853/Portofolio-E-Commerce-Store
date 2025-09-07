import dotenv from 'dotenv' 
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import router from "./routes/routes.js"
import cors from "cors"
import passport from "passport"
import session from "express-session"
import "./config/googlePassport.js"
import "./config/githubPassport.js"
import MongoStore from "connect-mongo"
import fs from 'fs';
import path from 'path';
import User from "./schemas/UserSchema.js"
import http from 'http'
import { Server } from "socket.io";
import Stripe from "stripe"

console.log('data in index.js')
console.log("frontendURL =", process.env.frontendURL);
console.log("DB =", process.env.DB);
console.log("SESSION_SECRET =", process.env.SESSION_SECRET);
console.log("googleClientID =", process.env.googleClientID);
console.log("googleClientSecret =", process.env.googleClientSecret);
console.log("googleCallbackURL =", process.env.googleCallbackURL);
console.log("githubClientID =", process.env.githubClientID);
console.log("githubClientSecret =", process.env.githubClientSecret);
console.log("githubCallbackURL =", process.env.githubCallbackURL);


const app = express()
const server = http.createServer(app);
const io = new Server(server , {
  cors:{
    origin: process.env.frontendURL,
    credentials: true
  }
})
app.set('io' , io)

const stripe = new Stripe(process.env.Secret_API)

const onlineUsers = new Map(); // key: userId, value: socket.id
export default onlineUsers



// Make sure uploads directory exists - modern approach
const uploadsDir = path.join(process.cwd(), "uploads" );

// Make uploads directory accessible
app.use('/uploads', express.static(uploadsDir));

app.use(session({
secret:process.env.SESSION_SECRET,
saveUninitialized:false,
resave:false,
store:MongoStore.create({
mongoUrl:process.env.DB,
collectionName: 'sessions',  // Collection where sessions are stored
ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (14 days)
})
}))

app.use(passport.initialize())
app.use(passport.session())

io.on('connection', (socket) => {

  // Expect user to send their ID after connecting
  socket.on('user-connected', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} is now online`);
  });

  socket.on('disconnect', () => {
    // Remove the disconnected user
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        console.log(`${userId} went offline`);
        break;
      }
    }
  });
});

app.use(cors({
    origin:process.env.frontendURL,
    credentials: true
}))

passport.serializeUser((user, done) => {
    done(null, user._id); // For local users, storing the _id in session
  });
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user); // Attach the user object to req.user
    } catch (error) {
      done(error)
    }
  });
app.use(express.json({ limit: '10mb' }));


app.use(router)

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // Create a Payment Intent with amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in smallest currency unit (e.g. cents)
      currency,
    });

    // Send client secret to frontend to confirm payment
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const handleConnect = async ()=>{
    await mongoose.connect(process.env.DB)
    console.log("db has been connected");
}
handleConnect()

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  try{
    handleConnect()
  }catch(err){
    console.log('failed ageain');
    setTimeout(()=>{handleConnect()},5000)
  }
});
mongoose.connection.on('error', () => {
  console.log('Mongoose disconnected from MongoDB');
  try{
    handleConnect()
  }catch(err){
    console.log('failed ageain');
    setTimeout(()=>{handleConnect()},5000)
  }
});


const PORT=8000
server.listen(PORT , ()=>{
    console.log("server started");
    
})