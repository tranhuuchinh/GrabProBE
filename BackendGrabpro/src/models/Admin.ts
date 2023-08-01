import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Types.ObjectId
    }
  },
  { timestamps: true }
)

export default mongoose.model('Admin', AdminSchema)
