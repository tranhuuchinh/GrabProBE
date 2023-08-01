import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      require: true
    },
    idCustomer: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    idDriver: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    from: {
      type: mongoose.Types.ObjectId
    },
    to: {
      type: mongoose.Types.ObjectId
    },
    distance: {
      type: String,
      trim: true
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0
    },
    method: {
      type: Number
    },
    feedback: {
      type: Number,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
      default: 1
    },
    tax: {
      type: Number,
      default: 0
    },
    baseTax: {
      type: Number,
      default: 0
    },
    sale: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    bookTime: {
      type: Date
    }
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)
