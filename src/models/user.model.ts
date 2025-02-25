import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;  // Explicitly define _id
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  businessName: string;
  google_id?: string;
  photo?: string;
  subscription: mongoose.Types.ObjectId;
}


const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    businessName : { type: String},
    google_id: { type: String, unique: true },
    photo: { type: String },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, required: true, default: false },
    password: { type: String,optional: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }, 
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
