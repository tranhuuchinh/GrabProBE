import mongoose, { Document, Types } from 'mongoose'

export interface IBill extends Document {
  idOrder: Types.ObjectId
  payfor: string
  createdAt: Date
  updatedAt: Date
}

const BillSchema = new mongoose.Schema(
  {
    idOrder: {
      type: mongoose.Types.ObjectId,
      ref: 'Order'
    },
    payfor: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model<IBill>('Bill', BillSchema)
