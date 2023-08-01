import mongoose from 'mongoose'

const BillSchema = new mongoose.Schema(
  {
    idOrder: {
      type: mongoose.Types.ObjectId
    },
    payfor: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Bill', BillSchema)
