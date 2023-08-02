import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICustomer extends Document {
  idAccount: Types.ObjectId
  fullname?: string
  location?: Types.ObjectId
  award?: number
  bonusPoint: number
  favoriteLocations?: Types.ObjectId[]
  savedLocations?: Types.ObjectId[]
  listMessages?: Types.ObjectId[]
  defaultMethod?: number
  listOrders?: Types.ObjectId[]
  listBills?: Types.ObjectId[]
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
      type: mongoose.Types.ObjectId
    },
    award: {
      type: Number,
      default: 0
    },
    bonusPoint: {
      type: Number,
      default: 0
    },
    favoriteLocations: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    savedLocations: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    listMessages: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    defaultMethod: {
      type: Number,
      default: 0
    },
    listOrders: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    listBills: [
      {
        type: mongoose.Types.ObjectId
      }
    ]
  },
  { timestamps: false }
)

export default mongoose.model<ICustomer>('Customer', CustomerSchema)
