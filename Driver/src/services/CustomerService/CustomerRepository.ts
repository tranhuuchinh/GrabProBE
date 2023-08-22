// customer.repository.ts
import { Model } from 'mongoose'
import { ICustomer } from '~/models/CustomerModel'
import { IAccount } from '~/models/AccountModel'

export class CustomerRepository {
  private customerModel: Model<ICustomer>
  private accountModel: Model<IAccount>

  constructor(customerModel: Model<ICustomer>, accountModel: Model<IAccount>) {
    this.customerModel = customerModel
    this.accountModel = accountModel
  }

  async updateCustomerAndAccount(
    id: string,
    fullname: string,
    email: string,
    phone: string
  ): Promise<[ICustomer | null, IAccount | null]> {
    const customer = await this.customerModel.findOneAndUpdate({ idAccount: id }, { fullname }, { new: true }).exec()
    const account = await this.accountModel
      .findByIdAndUpdate(id, { email, phone }, { new: true, runValidators: true })
      .exec()

    return [customer, account]
  }
}
