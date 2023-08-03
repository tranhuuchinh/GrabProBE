import mongoose from 'mongoose'

export interface IAward extends Document {
  id: number
  title: string
  minpoint?: number
  maxpoint?: number
}

const AwardSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      require: true
    },
    title: {
      type: String,
      trim: true
    },
    minpoint: {
      type: Number
    },
    maxpoint: {
      type: Number
    }
  },
  { timestamps: false }
)

export default mongoose.model<IAward>('Award', AwardSchema)
