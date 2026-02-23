import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
// @ts-ignore
import Components from '@uni-helper/vite-plugin-uni-components'
// @ts-ignore
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // 开发阶段启用源码映射：https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#需主动开启-sourcemap
    sourcemap: process.env.NODE_ENV === 'development',
  },
  plugins: [
    // make sure put it before `Uni()`
    Components({
      resolve: [WotResolver()],
    }),
    uni(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: `@use "style/base" as *;`,
        includePaths: [resolve(__dirname, 'src')],
        silenceDeprecations: ['import', 'global-builtin'],
      },
    },
  },
})
