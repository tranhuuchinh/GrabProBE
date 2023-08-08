import mongoose, { Document } from 'mongoose'

interface IBoxChat extends Document {
  idOrder: mongoose.Schema.Types.ObjectId
  idCustomer: mongoose.Schema.Types.ObjectId
  idDriver: mongoose.Schema.Types.ObjectId
  listMessages: mongoose.Schema.Types.ObjectId[]
}

const BoxChatSchema = new mongoose.Schema(
  {
    idOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    idCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    idDriver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    listMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  { timestamps: false }
)

export default mongoose.model<IBoxChat>('BoxChat', BoxChatSchema)
