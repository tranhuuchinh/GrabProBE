import mongoose from 'mongoose'

export interface IAccount extends Document {
  email: string
  phone: string
  password: string
  role: 'customer' | 'driver' | 'admin' | 'hotline'
}

const AccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: [true, 'Email must not empty'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email!'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone must not empty'],
      select: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password must not empty'],
      trim: true
    },
    role: {
      type: String,
      enum: ['customer', 'driver', 'admin', 'hotline'],
      default: 'customer'
    }
  },
  { timestamps: true }
)

export default mongoose.model<IAccount>('Account', AccountSchema)
