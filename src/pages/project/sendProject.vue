<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import type { UploadChangeEvent } from 'wot-design-uni/components/wd-upload/types'

// 表单数据
const formData = ref({
  title: '',
  industry: '',
  cooperationMode: '',
  cooperationScale: '',
  address: '',
  wechat: '',
  phone: '',
  introduction: '',
})

// 上传封面图
const cover = ref('')
const handleUpdateCover = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      cover.value = res.tempFilePaths[0]
    },
  })
}

// 行业类别选项
const industryOptions = ref([
  { value: 1, text: '餐饮美食' },
  { value: 2, text: '教育培训' },
  { value: 3, text: '零售百货' },
  { value: 4, text: '文旅娱乐' },
  { value: 5, text: '科技互联网' },
  { value: 6, text: '其他' },
])

// 合作方式选项
const modeOptions = ref([
  { value: 1, text: '资源合作' },
  { value: 2, text: '技术合作' },
  { value: 3, text: '联合运营' },
  { value: 4, text: '其他' },
])

// 合作规模选项
const scaleOptions = ref([
  { value: 1, text: '10W以下' },
  { value: 2, text: '10W-50W' },
  { value: 3, text: '50W-100W' },
  { value: 4, text: '100W以上' },
])

// 去填写项目介绍
const handleEditIntro = () => {
  // TODO: 跳转项目介绍编辑页
}

// 项目图片上传
const fileList = ref<any[]>([])
const action: string = 'https://x9zmst6evg.sealoshzh.site/upload/images'
const handleChange = (e: UploadChangeEvent) => {
  fileList.value = e.fileList
}

// 是否同意提交须知
const agreed = ref(false)

// 温馨提示
const tipsList = ref([
  '发布内容需经平台审核，审核通过后将展示在商机广场。',
  '请确保发布信息真实有效，禁止发布虚假或违规内容。',
  '提交后我们将在24小时内完成审核。',
])

// 查看提交须知
const handleNotice = () => {
  // TODO: 跳转提交须知页面
}

// 提交审核
const handleSubmit = () => {
  if (!cover.value) {
    return uni.showToast({ title: '请上传封面图片', icon: 'none' })
  }
  if (!formData.value.title) {
    return uni.showToast({ title: '请输入项目标题', icon: 'none' })
  }
  if (!agreed.value) {
    return uni.showToast({ title: '请先阅读并同意提交须知', icon: 'none' })
  }
  // TODO: 提交逻辑
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
            <uni-easyinput
              v-model="formData.title"
              :inputBorder="false"
              placeholder="请输入项目主题"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <uni-forms-item label="行业类别" name="industry">
            <uni-data-select
              v-model="formData.industry"
              :localdata="industryOptions"
              placeholder="请选择"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="合作方式" name="cooperationMode">
            <uni-data-select
              v-model="formData.cooperationMode"
              :localdata="modeOptions"
              placeholder="请选择"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="合作规模" name="cooperationScale">
            <uni-data-select
              v-model="formData.cooperationScale"
              :localdata="scaleOptions"
              placeholder="请选择合作规模"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="项目地址" name="address">
            <uni-easyinput
              v-model="formData.address"
              :inputBorder="false"
              placeholder="请输入项目地址"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <uni-forms-item label="联系微信" name="wechat">
            <uni-easyinput
              v-model="formData.wechat"
              :inputBorder="false"
              placeholder="请输入项目联系微信"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <uni-forms-item label="联系电话" name="phone">
            <uni-easyinput
              v-model="formData.phone"
              :inputBorder="false"
              placeholder="请输入项目联系电话"
              primaryColor="#ffd018"
              type="number"
              trim
            />
          </uni-forms-item>
          <uni-forms-item label="项目介绍" name="introduction">
            <view class="intro-row" @tap="handleEditIntro">
              <text class="intro-btn">去填写</text>
            </view>
          </uni-forms-item>
        </uni-forms>
        <!-- 项目图片上传 -->
        <view class="uploadSection">
          <wd-upload
            :file-list="fileList"
            image-mode="aspectFill"
            :action="action"
            :limit="6"
            @change="handleChange"
          ></wd-upload>
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

/* 项目介绍行 */
.intro-row {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .intro-btn {
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
