import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICustomer extends Document {
  idAccount: Types.ObjectId
  fullname?: string
  location?: Types.ObjectId
  award?: number
  bonusPoint: number
  favoriteLocations?: Types.ObjectId[]
  savedLocations?: Types.ObjectId[]
  defaultMethod?: number
}

const CustomerSchema = new mongoose.Schema(
  {
    idAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    fullname: {
      type: String,
      trim: true
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: 'Location'
    },
    bonusPoint: {
      type: Number,
      default: 0
    },
    favoriteLocations: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Location'
      }
    ],
    savedLocations: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Location'
      }
    ],
    defaultMethod: {
      type: Number,
      default: 1
    }
  },
  { timestamps: false }
)

export default mongoose.model<ICustomer>('Customer', CustomerSchema)
