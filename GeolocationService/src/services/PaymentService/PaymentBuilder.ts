import PaymentModel from '~/models/PaymentModel'

export class PaymentModelBuilder {
  private title?: string
  private image?: string

  withTitle(title: string): PaymentModelBuilder {
    this.title = title
    return this
  }

  withImage(image: string): PaymentModelBuilder {
    this.image = image
    return this
  }

  build() {
    return new PaymentModel({
      title: this.title,
      image: this.image
    })
  }
}
