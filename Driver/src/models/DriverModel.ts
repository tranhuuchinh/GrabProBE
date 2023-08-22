import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IDriver extends Document {
  idAccount: Types.ObjectId
  fullname?: string
  location?: Types.ObjectId
  transport?: object
  rating: number
  income: number
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
      ref: 'Location',
      default: null
    },
    transport: {
      name: {
        type: String,
        trim: true
      },
      code: {
        type: String,
        trim: true
      },
      color: {
        type: String,
        trim: true
      },
      type: {
        type: String,
        enum: ['motobike', '4seats', '7seats'],
        default: 'motobike'
      }
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
    }
  },
  { timestamps: false }
)

export default mongoose.model<IDriver>('Driver', DriverSchema)
