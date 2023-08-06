import { Types } from 'mongoose'
import { ICustomer } from '~/models/CustomerModel'
import { IDriver } from '~/models/DriverModel'
import { IHotline } from '~/models/HotlineModel'
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
}
