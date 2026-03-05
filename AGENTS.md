# AGENTS.md - qiansu-wx 项目编码指南

本文档为在 qiansu-wx 项目上工作的智能编码代理提供指南。涵盖构建命令、代码风格和约定。

## Cursor & Copilot 规则

未找到 `.cursor/rules/`、`.cursorrules` 或 `.github/copilot-instructions.md` 文件。请遵循本文档中概述的约定。

## 项目概述

qiansu-wx 是一个基于 UniApp (Vue 3 + TypeScript) 的多平台应用程序，目标平台包括微信小程序、H5 和原生应用。项目使用：

- **Vite** with `@dcloudio/vite-plugin-uni`
- **Pinia** 用于状态管理（支持持久化）
- **Wot‑Design‑Uni** UI 组件库
- **ESLint** + **Prettier** 用于代码质量
- **TypeScript** 与 Vue 3 `<script setup>` 语法

## 构建与开发命令

### 开发环境 (热重载)

```bash
npm run dev:h5                 # H5
npm run dev:mp-weixin          # WeChat Mini‑Program
npm run dev:app                # App
# 查看 package.json 了解其他平台 (mp‑alipay, mp‑qq 等)
```

### 生产构建

```bash
npm run build:h5               # H5
npm run build:mp-weixin        # WeChat Mini‑Program
npm run build:app              # App
# 其他平台类似
```

### 代码质量

```bash
npm run lint                   # ESLint with auto‑fix
npm run tsc                    # TypeScript type‑check (no emit)
npm run lint-staged            # Run lint on staged files (pre‑commit hook)
```

### Git 钩子

- 项目使用 **husky** + **lint‑staged**；pre‑commit 钩子会在暂存的 `.js`、`.ts`、`.vue` 文件上运行 ESLint。

## 代码风格指南

### 文件命名

- **Vue 组件**: `PascalCase.vue` 用于页面，`PascalCase.vue` 用于组件 (例如 `home.vue`, `productDetail.vue`, `NavHead.vue`)。
- **TypeScript 文件**: `camelCase.ts` 用于工具函数，`camelCase.ts` 用于 API，`camelCase.d.ts` 用于类型定义。
- **目录**: `camelCase` 用于 `src/` 下的子目录 (例如 `pagesMember/`, `stores/`)。

### 导入顺序

1. 外部依赖 (Vue, UniApp 等)
2. 内部别名导入 (`@/`)
3. 相对导入 (`.`)

示例:

```typescript
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { request } from '@/utils/http'
import type { UserItem } from '@/types/UserItem'
import { homeData } from './data'
```

类型导入始终使用 `import type`。

### Vue 组件

- 使用 `<script setup lang="ts">` 用于 Composition API。
- 使用 `defineProps<{ ... }>()` 或 `withDefaults()` 定义 props。
- 使用 Vue 的 `ref`、`computed`、`watch`。
- 生命周期钩子从 `@dcloudio/uni-app` 导入（`onLoad`、`onShow` 等）。
- 模板标签使用小写（UniApp 标签如 `view`、`text`、`image`）。
- 使用 `<style scoped lang="scss">` 定义作用域样式。

示例:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const count = ref(0)

onLoad(() => {
  // initialization
})
</script>

<template>
  <view class="container">
    <text>{{ count }}</text>
  </view>
</template>

<style scoped lang="scss">
.container {
  padding: 20rpx;
}
</style>
```

### TypeScript

- 使用严格类型；尽可能避免 `any`。
- 在 `src/types/` 下的 `.d.ts` 文件中定义接口/类型。
- API 响应类型包装在泛型 `Data<T>` 中（参见 `src/utils/http.ts`）。
- 函数返回类型应明确，特别是对于 promise。

示例:

```typescript
export const fetchUser = (id: string): Promise<Data<UserItem>> => {
  return request<UserItem>({ method: 'GET', url: `/user/${id}` })
}
```

### 状态管理 (Pinia)

- 存储定义在 `src/stores/modules/` 中，使用 setup 函数语法。
- 使用 `defineStore('name', () => { ... })` 与 refs 和 computed。
- 为小程序存储配置了持久化。

示例:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserItem } from '@/types/UserItem'

export const useUserStore = defineStore(
  'user',
  () => {
    const profile = ref<UserItem>()
    const setProfile = (val: Partial<UserItem>) => {
      profile.value = { ...profile.value, ...val }
    }
    return { profile, setProfile }
  },
  { persist: { ... } }
)
```

### 错误处理

- 网络错误由 `src/utils/http.ts` 拦截器处理。
- 面向用户的错误应使用 `uni.showToast` 并设置 `icon: 'none'`。
- 避免静默失败；开发期间记录错误。

示例:

```typescript
try {
  await someApi()
} catch (err) {
  uni.showToast({
    icon: 'none',
    title: '操作失败，请重试',
  })
  console.error(err)
}
```

### 格式化规则 (Prettier)

- **Single quotes** (`'`)
- **No semicolons**
- **Print width**: 100 characters
- **Trailing commas**: `all`
- **End of line**: `auto`

这些规则由 ESLint 的 `prettier/prettier` 规则强制执行。

### ESLint 规则

- `vue/multi-word-component-names`: **off** (allows single‑word component names)
- `vue/no-setup-props-destructure`: **off**
- `@typescript-eslint/no-unused-vars`: **off** (temporarily disabled)
- `prettier/prettier`: `warn` with the above Prettier options

全局变量 (`uni`, `wx`, `getCurrentPages` 等) 已加入白名单。

## 测试

- **当前未配置测试框架。**
- 如果后续添加测试，考虑使用 `vitest` + `@vue/test-utils` 进行单元测试，使用 `@dcloudio/uni-automator` 进行 UniApp 自动化测试。

## 项目结构

```
src/
├── api/              # API 请求函数
├── components/       # 可复用的 Vue 组件
├── pages/           # 页面组件 (H5/小程序页面)
├── pagesMember/     # 会员相关页面
├── stores/          # Pinia 存储 (modules/ 子目录)
├── types/           # TypeScript 定义 (.d.ts)
├── utils/           # 工具函数 (http, 验证等)
├── composables/     # 组合式函数 (Vue 3)
└── style/           # 全局 SCSS 变量/混合
```

## Aliases

- `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.json`)

## UniApp 特定说明

- 使用 `uni` API 进行平台特定操作（导航、存储等）。
- 页面在 `src/pages.json` 中注册（UniApp 路由配置）。
- `wot-design-uni` 组件通过 `@uni-helper/vite-plugin-uni-components` 自动导入。
- 样式使用 `rpx` 单位进行响应式设计。

## 提交前检查

1. 运行 `npm run lint` 确保代码风格一致。
2. 运行 `npm run tsc` 验证无 TypeScript 错误。
3. 确保项目为目标平台构建成功（`npm run build:h5` 或相应命令）。

## 附加资源

- [UniApp Vue 3 Migration Guide](https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html)
- [Wot‑Design‑Uni Documentation](https://wot-design-uni.gitee.io/)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

_本文档旨在为在代码库上工作的 AI 代理提供指导。当约定更改时请更新此文件。_
