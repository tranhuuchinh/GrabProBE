import express from 'express'
import { publishToMediator, setupMediator } from '~/services/CallCenterService/mediator'
import { catchAsync } from '~/utils/catchAsync'

export default {
  requestBook: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const customerData = req.body
      const address = customerData.address

      // if (address !== '') {
      //   if (address !== 'SEARCH') {
      //     // Thông tin địa điểm đón khách hàng cung cấp đã được định vị
      //     // Chuyển sang điều phối
      //     publishToMediator({
      //       type: 'GEOLOCATION_RESOLVED',
      //       data: customerData
      //     })
      //   } else {
      //     // Đưa sang định vị
      //     publishToMediator({ type: 'CUSTOMER_REQUESTED', data: customerData })
      //   }
      // }
      console.log(123445677)
      publishToMediator({ type: 'CUSTOMER_REQUESTED', data: customerData })

      res.status(200).json({
        status: 'success',
        data: 'Booking is being solved!'
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
