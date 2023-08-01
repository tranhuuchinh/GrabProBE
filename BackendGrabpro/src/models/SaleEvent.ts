import mongoose from 'mongoose'

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

export default mongoose.model('Sale', SaleSchema)
