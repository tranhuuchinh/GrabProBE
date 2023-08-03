import mongoose, { Document, Types } from 'mongoose'

export interface ISale extends Document {
  title: string
  type: 'GrabCar' | 'GrabBike'
  image: string
  points: number
}

const SaleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['GrabCar', 'GrabBike'],
      default: 'GrabCar'
    },
    image: {
      type: String
    },
    points: {
      type: Number
    }
  },
  { timestamps: false }
)

export default mongoose.model<ISale>('Sale', SaleSchema)
