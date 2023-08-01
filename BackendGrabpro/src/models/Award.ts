import mongoose from 'mongoose'

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

export default mongoose.model('Award', AwardSchema)
