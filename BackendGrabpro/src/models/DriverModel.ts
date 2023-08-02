import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IDriver extends Document {
  idAccount: Types.ObjectId
  fullname?: string
  location?: Types.ObjectId
  transport?: object
  rating: number
  income: number
  listOrder?: Types.ObjectId[]
  listMessage?: Types.ObjectId[]
}

const DriverSchema = new mongoose.Schema(
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
      default: null
    },
    transport: {
      type: Object,
      default: {}
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
      default: 1
    },
    income: {
      type: Number,
      default: 0
    },
    listOrder: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    listMessage: [
      {
        type: mongoose.Types.ObjectId
      }
    ]
  },
  { timestamps: false }
)

export default mongoose.model<IDriver>('Driver', DriverSchema)
