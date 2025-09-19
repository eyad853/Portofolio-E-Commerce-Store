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
import sharedsession from "express-socket.io-session";
import { fileURLToPath } from 'url'

const app = express()
const server = http.createServer(app);
const io = new Server(server , {
  cors:{
    origin: process.env.frontendURL,
     methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})
app.set('io' , io)

const stripe = new Stripe(process.env.Secret_API)

const onlineUsers = new Map(); // key: userId, value: socket.id
export default onlineUsers

app.use(cors({
    origin:process.env.frontendURL,
    credentials: true
}))

// Make sure uploads directory exists - modern approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

// Make uploads directory accessible
app.use('/uploads', express.static(uploadsDir));

app.set('trust proxy', 1); // important when behind HTTPS reverse proxy

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    httpOnly: true,
    secure: false,   // use true if your backend is running on HTTPS
    sameSite: "lax"
  }
});

app.use(sessionMiddleware)


app.use(passport.initialize())
app.use(passport.session())

io.use(sharedsession(sessionMiddleware, {
  autoSave: true
})); // for Socket.IO



io.on('connection', (socket) => {
  console.log('server connected with sockers');
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


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    setTimeout(connectDB, 5000); // retry safely
  }
};

mongoose.connection.on('disconnected', () => {
  console.log("MongoDB disconnected, retrying...");
  connectDB(); // retry only DB, do NOT touch socket logic
});

connectDB();


const PORT=8000
server.listen(PORT , ()=>{
    console.log("server started");
    
})