/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'uqrcodejs' {
  interface QRModule {
    isBlack: boolean
  }

  class UQRCode {
    data: string
    size: number
    canvasContext: any
    modules: QRModule[][]
    make(): void
    drawCanvas(): void
  }
  export default UQRCode
}
