import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  business :string;
  subscription:mongoose.Types.ObjectId
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    business : { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, required: true, default: false },
    password: { type: String,optional: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }, 
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
