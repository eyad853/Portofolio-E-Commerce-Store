import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   // Reference to the customer who placed the order
        required: true
    },
    darkMode: {
        type: Boolean,
        default: false, 
    },
}, { timestamps: true });

const UserSetting = mongoose.model('UserSetting', userSettingsSchema);

export default UserSetting;