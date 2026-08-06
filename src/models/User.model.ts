import { Schema, model, Document } from 'mongoose';

export type UserRole = 'admin' | 'waiter' | 'chef';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hasheado
  role: UserRole;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'waiter', 'chef'],
      required: true,
      default: 'waiter',
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);