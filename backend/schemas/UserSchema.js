import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: { 
        type: String, 
        unique: true 
        },
    password: String, // only for local users

    googleId: String, // only for Google users
    githubId: String, // only for GitHub users

    avatar: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    adminType: {
        type: String,
        enum: ['real', 'fake', null],
        default: null
    },
    location:{
        type:String,
        default:""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;