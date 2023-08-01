import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema(
  {
    id: {
      type: Number
    },
    image: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    }
  },
  { timestamps: false }
)

export default mongoose.model('Payment', PaymentSchema)
