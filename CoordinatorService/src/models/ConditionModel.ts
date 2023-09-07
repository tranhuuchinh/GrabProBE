import mongoose from 'mongoose'

export interface ICondition extends Document {
  value: string
}

const ConditionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model<ICondition>('Condition', ConditionSchema)
