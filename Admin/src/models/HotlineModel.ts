import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IHotline extends Document {
  idAccount: Types.ObjectId
  award?: number
  bonusPoint: number
  fullname?: string
  listOrder?: Types.ObjectId[]
  favoriteLocations?: Types.ObjectId[]
}

const HotlineSchema = new mongoose.Schema(
  {
    idAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    award: {
      type: Number,
      default: 0
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
        type: mongoose.Types.ObjectId,
        ref: 'Order'
      }
    ],
    favoriteLocations: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Location'
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Hotline', HotlineSchema)
