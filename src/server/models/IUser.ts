import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'instructor', 'admin'] }
});

export const User = mongoose.model<IUser>('User', userSchema);