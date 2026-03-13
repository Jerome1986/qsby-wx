<script setup lang="ts">
import { projectAllCateGetApi, projectSendApi } from '@/api/project'
import NavHead from '@/components/NavHead.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { ProjectFormData } from '@/types/Project'
import type { UploadChangeEvent, UploadFileItem } from 'wot-design-uni/components/wd-upload/types'
import { useUserStore } from '@/stores'
import { validateProjectForm } from './verifySendParams'

const userStore = useUserStore()

// 表单数据
const formData = ref<ProjectFormData>({
  title: '',
  industry: '',
  cooperationMode: '',
  cooperationScale: '',
  address_name: '',
  event_address: '',
  latitude: undefined,
  longitude: undefined,
  wechat: '',
  phone: '',
  introduction: '',
})

// 上传封面图（本地预览 + 上传获取 URL）
const cover = ref('')
const handleUpdateCover = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      cover.value = res.tempFilePaths[0]
      const name = 'cover' + Date.now()
      uni.uploadFile({
        url: 'https://x9zmst6evg.sealoshzh.site/upload/images',
        filePath: res.tempFilePaths[0],
        name,
        success: (uploadRes) => {
          formData.value.cover = uploadRes.data as string
        },
      })
    },
  })
}

// 行业类别选项（value 为分类 _id）
const industryOptions = ref<{ value: string, text: string }[]>([])
// 合作方式选项
const modeOptions = ref<{ value: string, text: string }[]>([])
// 合作规模选项
const scaleOptions = ref<{ value: string, text: string }[]>([])
const projectTypeGet = async () => {
  const res = await projectAllCateGetApi()
  industryOptions.value = res.data.typeList.map(item => ({
    value: item._id,
    text: item.name
  }))
  modeOptions.value = res.data.modeList.map(item => ({
    value: item._id,
    text: item.name
  }))
  scaleOptions.value = res.data.scaleList.map(item => ({
    value: item._id,
    text: item.name
  }))
}

onLoad(() => projectTypeGet())

// 地图选点
const changeLocal = () => {
  uni.chooseLocation({
    success: (res) => {
      formData.value.address_name = res.name
      formData.value.event_address = res.address
      formData.value.latitude = res.latitude
      formData.value.longitude = res.longitude
    },
    fail: () => {
      uni.showToast({ icon: 'none', title: '地图打开失败' })
    },
  })
}

// 项目介绍：点击「去填写」展开输入框
const showIntroInput = ref(false)

// 项目图片上传
const fileList = ref<UploadFileItem[]>([])
const action: string = 'https://x9zmst6evg.sealoshzh.site/upload/images'
const handleChange = (e: UploadChangeEvent) => {
  fileList.value = e.fileList
}

/** 从 fileList 每项的 response 中提取图片链接 */
const getImagesFromFileList = (list: UploadFileItem[]): string[] => {
  return list
    .map((file) => {
      const res = file.response
      if (typeof res === 'string') return res
      if (res && typeof res === 'object' && 'data' in res) return (res as { data: string }).data
      return ''
    })
    .filter(Boolean)
}

// 是否同意提交须知
const agreed = ref(false)

// 查看提交须知
const handleNotice = () => {
  // TODO: 跳转提交须知页面
}

// 提交审核
const handleSubmit = async () => {
  const userId = userStore.profile?._id
  if (!validateProjectForm({
    cover: cover.value,
    formData: formData.value,
    agreed: agreed.value,
    userId,
  })) return

  const images = getImagesFromFileList(fileList.value)
  const submitData = {
    userId: userId as string,
    cover: formData.value.cover,
    title: formData.value.title,
    industry: formData.value.industry,
    cooperationMode: formData.value.cooperationMode,
    cooperationScale: formData.value.cooperationScale,
    address_name: formData.value.address_name,
    event_address: formData.value.event_address,
    latitude: formData.value.latitude,
    longitude: formData.value.longitude,
    wechat: formData.value.wechat,
    phone: formData.value.phone,
    introduction: formData.value.introduction ?? '',
    images,
  }
  console.log('提交前的参数', submitData)
  const res = await projectSendApi(submitData)
  if (res.code === 200) {
    uni.showToast({ icon: 'success', title: '已提交审核', mask: true })
    uni.navigateBack()
  }
}
</script>

<template>
  <view class="sendProject">
    <NavHead title="发布项目" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 上传封面图 -->
      <view class="updateCover" @tap="handleUpdateCover" v-if="!cover">
        <view class="title">
          <text class="iconfont icon-tupian" style="margin-right: 8rpx"></text>
          <text>上传封面图片</text>
        </view>
        <view class="text">支持JPG、PNG格式，文件大小不超2.5MB</view>
      </view>
      <!-- 预览图 -->
      <view class="cover" v-else @tap="handleUpdateCover">
        <image :src="cover" mode="widthFix"></image>
        <view class="cover-mask">
          <text class="iconfont icon-tupian"></text>
          <text>点击更换</text>
        </view>
      </view>

      <!-- 表单 -->
      <view class="formCard">
        <uni-forms ref="formRef" :modelValue="formData" labelWidth="160rpx">
          <uni-forms-item label="项目标题" name="title">
            <uni-easyinput v-model="formData.title" :inputBorder="false" placeholder="请输入项目主题" primaryColor="#ffd018"
              trim />
          </uni-forms-item>
          <uni-forms-item label="行业类别" name="industry">
            <uni-data-select v-model="formData.industry" :localdata="industryOptions"
              placeholder="请选择"></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="合作方式" name="cooperationMode">
            <uni-data-select v-model="formData.cooperationMode" :localdata="modeOptions"
              placeholder="请选择"></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="合作规模" name="cooperationScale">
            <uni-data-select v-model="formData.cooperationScale" :localdata="scaleOptions"
              placeholder="请选择合作规模"></uni-data-select>
          </uni-forms-item>
          <!-- 行程地点 -->
          <uni-forms-item label="行程地点" name="address_name">
            <view class="location-row">
              <uni-easyinput v-model="formData.address_name" :inputBorder="false" placeholder="请选择行程地点"
                primaryColor="#ffd018" disabled trim />
              <view class="search-btn" @tap="changeLocal">搜索</view>
            </view>
          </uni-forms-item>
          <!-- 行程地址 -->
          <uni-forms-item label="行程地址" name="event_address">
            <uni-easyinput v-model="formData.event_address" :inputBorder="false" placeholder="请选择行程地址"
              primaryColor="#ffd018" trim />
          </uni-forms-item>
          <uni-forms-item label="联系微信" name="wechat">
            <uni-easyinput v-model="formData.wechat" :inputBorder="false" placeholder="请输入项目联系微信" primaryColor="#ffd018"
              trim />
          </uni-forms-item>
          <uni-forms-item label="联系电话" name="phone">
            <uni-easyinput v-model="formData.phone" :inputBorder="false" placeholder="请输入项目联系电话" primaryColor="#ffd018"
              type="number" trim />
          </uni-forms-item>
          <uni-forms-item label="项目介绍" name="introduction">
            <view class="intro-row" v-show="!showIntroInput" @tap="showIntroInput = true">
              <text class="intro-placeholder">去填写</text>
            </view>
          </uni-forms-item>
          <wd-textarea v-if="showIntroInput" v-model="formData.introduction" placeholder="请输入项目介绍" :maxlength="500" />
        </uni-forms>
        <!-- 项目图片上传 -->
        <view class="uploadSection">
          <wd-upload :file-list="fileList" image-mode="aspectFill" :action="action" :limit="6" multiple
            @change="handleChange"></wd-upload>
        </view>
        <!-- 免责声明勾选 -->
        <view class="agreement" @tap="agreed = !agreed">
          <radio :checked="agreed" color="#ffd018" style="transform: scale(0.7)" />
          <text class="agree-text">我已仔细阅读并同意</text>
          <text class="agree-link" @tap.stop="handleNotice">《提交须知》</text>
        </view>
        <!-- 提交审核 -->
        <view class="submit">
          <view class="submit-btn" @tap="handleSubmit">提交审核</view>
          <view class="submit-tip">提交后我们将在24小时内完成审核</view>
        </view>
      </view>

      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.sendProject {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  padding: 24rpx 24rpx 120rpx;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

/* 上传封面图 */
.updateCover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 219rpx;
  border-radius: 20rpx;
  border: 2rpx solid #e4e4e4;
  font-size: 28rpx;
  color: $qs-font-dec2;
  background-color: #ffffff;
}

/* 封面图预览 */
.cover {
  position: relative;
  width: 440rpx;
  margin: 0 auto;
  border-radius: 20rpx;
  overflow: hidden;

  image {
    width: 100%;
    display: block;
  }

  .cover-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    font-size: 22rpx;

    .iconfont {
      font-size: 40rpx;
      margin-bottom: 6rpx;
    }
  }
}

/* 表单卡片 */
.formCard {
  margin-top: 24rpx;
  padding: 0 24rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  @include customShadow();

  :deep(.uni-forms) {
    .uni-forms-item {
      padding: 24rpx 0;
      margin-bottom: 0;
      border-bottom: 1px solid $qs-border;

      .uni-forms-item__label {
        font-size: 28rpx;
        color: $qs-font-title;
        font-weight: 500;
        padding: 0;
      }

      .uni-forms-item__content {
        display: flex;
        align-items: center;
      }
    }

    .uni-forms-item:last-child {
      border-bottom: none;
    }
  }

  :deep(.uni-easyinput) {
    .uni-easyinput__content {
      background-color: transparent !important;
      padding: 0 !important;
    }

    .uni-easyinput__placeholder-class {
      font-size: 28rpx;
      color: $qs-font-dec2;
    }

    .uni-easyinput__content-input {
      font-size: 28rpx;
      color: $qs-font-title;
      text-align: left;
    }
  }

  :deep(.uni-stat__select) {
    .uni-stat-box {
      background-color: transparent;
    }

    .uni-select {
      border: none !important;

      .uni-select__input-text {
        font-size: 28rpx;
      }

      .uni-select__input-placeholder {
        color: $qs-font-dec2;
      }
    }
  }
}

/* 行程地点行 */
.location-row {
  flex: 1;
  display: flex;
  align-items: center;

  .search-btn {
    flex-shrink: 0;
    margin-left: 16rpx;
    padding: 8rpx 24rpx;
    background: $qs-brandColor;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: $qs-font-title;
  }
}

/* 项目介绍行（参考 public 行程需求） */
.intro-row {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .intro-placeholder {
    padding: 8rpx 24rpx;
    background: $qs-brandColor;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: $qs-font-title;
  }
}

/* 项目图片上传 */
.uploadSection {
  padding: 24rpx 0;

  .upload-count {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: $qs-font-dec2;
  }
}

/* 免责声明勾选 */
.agreement {
  display: flex;
  align-items: center;
  padding: 24rpx 0 0;

  .agree-text {
    font-size: 26rpx;
    color: $qs-font-dec;
  }

  .agree-link {
    font-size: 26rpx;
    color: $qs-brandColor;
  }
}

/* 提交审核 */
.submit {
  padding: 30rpx 0 40rpx;
  text-align: center;

  .submit-btn {
    width: 309rpx;
    height: 87rpx;
    line-height: 87rpx;
    margin: 0 auto;
    font-size: 32rpx;
    font-weight: 600;
    color: $qs-font-title;
    background: $qs-brandColor;
    border-radius: 44rpx;
  }

  .submit-tip {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: $qs-font-dec2;
  }
}
</style>
