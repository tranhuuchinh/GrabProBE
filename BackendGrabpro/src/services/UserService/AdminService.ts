import { Types } from 'mongoose'
import { IUser } from './UserFactory'
import Admin from '~/models/AdminModel'
import Account from '~/models/AccountModel'

export default class AdminService {
  constructor(
    private idAccount: Types.ObjectId,
    private fullname?: string
  ) {}

  public async createUser(): Promise<IUser> {
    try {
      return await (
        await Admin.create({
          idAccount: this.idAccount,
          fullname: this.fullname
        })
      ).populate('idAccount')
    } catch (e: any) {
      await Account.findByIdAndDelete(this.idAccount)
      throw new Error(e.message)
    }
  }

  public async getUser() {
    try {
      return await Admin.find({}).exec()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
