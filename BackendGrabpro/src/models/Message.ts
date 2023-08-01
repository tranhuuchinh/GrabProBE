import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    idSender: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    idReceiver: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    content: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Message', MessageSchema)
