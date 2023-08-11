import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IAdmin extends Document {
  idAccount: Types.ObjectId
  fullname?: string
}

const AdminSchema = new mongoose.Schema(
  {
    idAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    fullname: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model<IAdmin>('Admin', AdminSchema)
