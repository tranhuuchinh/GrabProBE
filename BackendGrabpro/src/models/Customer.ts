import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Types.ObjectId
    },
    fullname: {
      type: String,
      trim: true
    },
    location: {
      type: mongoose.Types.ObjectId
    },
    award: {
      type: Number
    },
    bonusPoint: {
      type: Number,
      default: 0
    },
    favoriteLocations: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    savedLocations: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    listMessages: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    defaultMethod: {
      type: Number
    },
    listOrders: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    listBills: [
      {
        type: mongoose.Types.ObjectId
      }
    ]
  },
  { timestamps: false }
)

export default mongoose.model('Customer', CustomerSchema)
