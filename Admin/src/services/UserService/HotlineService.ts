import { Types } from 'mongoose'
import { IUser } from './UserFactory'
import Hotline from '~/models/HotlineModel'
import Account from '~/models/AccountModel'

export default class HotlineService {
  constructor(
    private idAccount: Types.ObjectId,
    private fullname?: string
  ) {}

  public async createUser(): Promise<IUser> {
    try {
      return await (
        await Hotline.create({
          idAccount: this.idAccount,
          fullname: this.fullname
        })
      ).populate('idAccount')
    } catch (e: any) {
      await Account.findByIdAndDelete(this.idAccount)
      throw new Error(e.message)
    }
  }

  public async getAllUser() {
    try {
      return await Hotline.find({}).exec()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public async deleteUser() {
    try {
      return await Hotline.findByIdAndDelete(this.idAccount).exec()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
