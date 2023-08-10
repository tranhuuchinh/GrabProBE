import mongoose, { Document } from 'mongoose'

export interface IMessage extends Document {
  idSender: mongoose.Schema.Types.ObjectId
  idReceiver: mongoose.Schema.Types.ObjectId
  content: string
}

const MessageSchema = new mongoose.Schema(
  {
    idSender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    idReceiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Message', MessageSchema)
