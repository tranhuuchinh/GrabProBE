import mongoose from 'mongoose'

const TypeTransportSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    name: {
      type: String,
      trim: true
    },
    priceperKm: {
      type: Number,
      default: 0
    }
  },
  { timestamps: false }
)

export default mongoose.model('TypeTransport', TypeTransportSchema)
