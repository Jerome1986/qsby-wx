/**
 * QrScene 集合
 * _id:
 * sceneCode
 * type
 * inviterCode
 * productId
 * proType
 * qrCodeUrl
 * createdAt
 */

export interface QrScene {
  _id: string
  sceneCode: string
  type: string
  inviterCode: string
  productId: string
  proType: string
  qrCodeUrl: string
  createdAt: Date
}
