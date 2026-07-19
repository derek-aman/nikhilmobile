import mongoose from 'mongoose';

const shopSettingsSchema = new mongoose.Schema(
  {
    shopName: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    mapUrl: String,
    workingHours: {
      open: String,
      close: String
    },
    slotDuration: Number,
    maxBookingsPerSlot: Number
  },
  { timestamps: true }
);

const ShopSettings = mongoose.model('ShopSettings', shopSettingsSchema);
export default ShopSettings;