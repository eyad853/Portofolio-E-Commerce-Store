import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'My E-Commerce Store',
  },
  logo: {
    type: String, // URL or path to the logo image
    default: '/images/default-logo.png',
  },
  darkMode: {
    type: Boolean,
    default: false, 
  },
  maintenanceMode: {
    type: Boolean,
    default: false, // store is live by default
  },
  currencySymbol: {
    type: String,
    default: '$',
  },
}, { timestamps: true });

const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);

export default AdminSettings;