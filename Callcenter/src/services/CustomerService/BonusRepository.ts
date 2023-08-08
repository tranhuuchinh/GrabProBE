// customer.repository.ts
import { Model } from 'mongoose'
import { ICustomer } from '~/models/CustomerModel'

export class BonusRepository {
  private customerModel: Model<ICustomer>

  constructor(customerModel: Model<ICustomer>) {
    this.customerModel = customerModel
  }

  async updateBonusPoint(id: string, bonusPoint: number): Promise<ICustomer | null> {
    const customer = await this.customerModel.findOneAndUpdate({ idAccount: id }, { bonusPoint }, { new: true }).exec()

    return customer
  }
}
