import mongoose from 'mongoose'

export interface ITypeTransport extends Document {
  id: number
  name: string
  priceperKm: number
}

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

export default mongoose.model<ITypeTransport>('TypeTransport', TypeTransportSchema)
