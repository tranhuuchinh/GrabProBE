import mongoose from 'mongoose'

export interface IPayment extends Document {
  image: string
  title: string
}

const PaymentSchema = new mongoose.Schema(
  {
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

export default mongoose.model<IPayment>('Payment', PaymentSchema)
