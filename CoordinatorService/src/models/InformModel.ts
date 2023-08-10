import mongoose from 'mongoose'

export interface IInform extends Document {
  idReceiver: mongoose.Types.ObjectId
  status: 'vouncher' | 'inform'
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

const InformSchema = new mongoose.Schema(
  {
    idReceiver: {
      type: mongoose.Types.ObjectId
    },
    status: {
      type: String,
      enum: ['vouncher', 'inform'],
      default: 'inform',
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model<IInform>('Inform', InformSchema)
