import mongoose, { Document, Types } from 'mongoose'

export interface IOrder extends Document {
  code: string
  idCustomer: Types.ObjectId
  idDriver: Types.ObjectId
  from?: Types.ObjectId
  to?: Types.ObjectId
  distance?: string
  status: number
  method?: number
  feedback: number
  tax: number
  baseTax: number
  sale: number
  totalPrice: number
  bookTime?: Date
}

const OrderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      require: true
    },
    idCustomer: {
      type: mongoose.Types.ObjectId
    },
    idDriver: {
      type: mongoose.Types.ObjectId
    },
    from: {
      type: mongoose.Types.ObjectId,
      ref: 'Location'
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: 'Location'
    },
    type: {
      type: String,
      enum: ['motobike', '4seats', '7seats'],
      default: 'motobike'
    },
    distance: {
      type: String,
      trim: true
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0
    },
    method: {
      type: Number
    },
    feedback: {
      type: Number,
      default: 0
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

export default mongoose.model<IOrder>('Order', OrderSchema)
