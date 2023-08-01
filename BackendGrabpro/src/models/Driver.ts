import mongoose from 'mongoose'

const DriverSchema = new mongoose.Schema(
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
    transport: {
      type: Object
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
      default: 1
    },
    income: {
      type: Number,
      default: 0
    },
    listOrder: [
      {
        type: mongoose.Types.ObjectId
      }
    ],
    listMessage: [
      {
        type: mongoose.Types.ObjectId
      }
    ]
  },
  { timestamps: false }
)

export default mongoose.model('Driver', DriverSchema)
