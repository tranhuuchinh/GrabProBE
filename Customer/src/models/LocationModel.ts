import mongoose, { Document } from 'mongoose'

export interface ILocation extends Document {
  address?: string
  description?: string
  latitude?: number
  altitude?: number
}

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

export default mongoose.model<ILocation>('Location', LocationSchema)
