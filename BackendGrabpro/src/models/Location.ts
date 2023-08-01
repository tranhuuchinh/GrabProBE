import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    latitude: {
      type: Number
    },
    altitude: {
      type: Number
    }
  },
  { timestamps: false }
)

export default mongoose.model('Location', LocationSchema)
