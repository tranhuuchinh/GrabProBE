import { Types } from 'mongoose'
import { IUser } from './UserFactory'
import Driver from '~/models/DriverModel'
import Account from '~/models/AccountModel'

export default class DriverService {
  constructor(
    private idAccount: Types.ObjectId,
    private fullname?: string
  ) {}

  public async createUser(): Promise<IUser> {
    try {
      return await (
        await Driver.create({
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
      return await Driver.find({}).exec()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
