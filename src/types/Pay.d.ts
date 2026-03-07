// 支付成功返回类型
export interface PayResult {
  timeStamp: string
  nonceStr: string
  packageValue: string
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA'
  paySign: string
  orderId: string
}
