import { ObjectId, Types } from 'mongoose'
import CustomerModel, { ICustomer } from '~/models/CustomerModel'
import DriverModel, { IDriver } from '~/models/DriverModel'
import HotlineModel, { IHotline } from '~/models/HotlineModel'
import Account, { IAccount } from '~/models/AccountModel'
import CustomerService from './CustomerService'
import DriverService from './DriverService'
import HotlineService from './HotlineService'
import AdminService from './AdminService'

export type IUser = ICustomer | IDriver | IHotline | IAccount

export default class UserFactory {
  public static async createUser(
    typeUser: string,
    email: string,
    phone: string,
    password: string,
    fullname: string
  ): Promise<IUser> {
    try {
      const account = await Account.create({
        phone,
        password,
        email,
        role: typeUser
      })
      switch (typeUser) {
        case 'customer':
          return new CustomerService(account?.id, fullname).createUser()
        case 'driver':
          return new DriverService(account?.id, fullname).createUser()
        case 'hotline':
          return new HotlineService(account?.id, fullname).createUser()
        case 'admin':
          return new AdminService(account?.id, fullname).createUser()
        default:
          return new CustomerService(account?.id, fullname).createUser()
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public static async getAllUser(typeUser: string) {
    try {
      switch (typeUser) {
        case 'customer':
          return new CustomerService('' as unknown as Types.ObjectId, '').getAllUser()
        case 'driver':
          return new DriverService('' as unknown as Types.ObjectId, '').getAllUser()
        case 'hotline':
          return new HotlineService('' as unknown as Types.ObjectId, '').getAllUser()
        default:
          return new CustomerService('' as unknown as Types.ObjectId, '').getAllUser()
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public static async deleteUser(typeUser: string, idAccount: string) {
    try {
      if (typeUser === 'customer') {
        const account = await CustomerModel.findOne({ idAccount: idAccount }).exec()

        return new CustomerService(account?._id, '').deleteUser()
      } else if (typeUser === 'driver') {
        const account = await DriverModel.findOne({ idAccount: idAccount }).exec()

        return new DriverService(account?._id, '').deleteUser()
      } else if (typeUser === 'hotline') {
        const account = await HotlineModel.findOne({ idAccount: idAccount }).exec()

        return new HotlineService(account?._id as unknown as Types.ObjectId, '').deleteUser()
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
