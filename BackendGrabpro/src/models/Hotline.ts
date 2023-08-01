import mongoose from 'mongoose'

const HotlineSchema = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Types.ObjectId
    },
    award: {
      type: Number
    },
    bonusPoint: {
      type: Number,
      default: 0
    },
    fullname: {
      type: String,
      trim: true
    },
    listOrder: [
      {
        type: mongoose.Types.ObjectId
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Hotline', HotlineSchema)
