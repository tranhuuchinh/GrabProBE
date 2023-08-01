import mongoose from 'mongoose'

const InformSchema = new mongoose.Schema(
  {
    idReceiver: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    status: {
      type: String,
      enum: ['vouncher', 'inform'],
      default: 'inform',
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Inform', InformSchema)
