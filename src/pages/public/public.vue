<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'

// 表单数据
const formData = ref({
  title: '', // 行程主题
  type: '', // 行程类型
  time: '', // 行程时间
  address_name: '', // 行程地点--地图上的商户名
  event_address: '', // 行程地址--地图上的具体位置
  latitude: '', // 纬度
  longitude: '', // 经度
  wechat: '', // 联系微信
  phone: '', // 联系电话
  maxPeople: '', // 人数限制
  maleCount: '', // 男士报名
  femaleCount: '', // 女士报名
  userFee: '', // 用户报名费用
  commission: '', // 主理人佣金
  requirement: '', // 行程需求
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

// 行程类型选项
const typeOptions = ref([
  { value: 1, text: '类型1' },
  { value: 2, text: '类型2' },
])

// 去填写行程需求
const handleEditRequirement = () => {
  // TODO: 跳转行程需求编辑页
}

interface imageItem {
  name: string
  extname: string
  url: string
}

// 行程图片上传
const imageValue = ref<any[]>([])
const filePickerRef = ref()

const select = (e: any) => {
  const existNames = new Set(imageValue.value.map((img: imageItem) => img.name))
  const dupIndexes: number[] = []

  e.tempFiles.forEach((item: imageItem, index: number) => {
    if (existNames.has(item.name)) {
      dupIndexes.push(imageValue.value.length - e.tempFiles.length + index)
    }
  })

  // 从后往前删除，避免索引偏移
  dupIndexes.reverse().forEach((i) => {
    filePickerRef.value?.clearFiles(i)
  })
}

const progress = (e: any) => {
  console.log('上传进度：', e)
}

const success = (e: any) => {
  console.log('上传成功：', e)
}

const fail = (e: any) => {
  console.log('上传失败：', e)
}

// 提交审核
const handleSubmit = () => {
  // TODO: 表单校验 & 提交逻辑
}

// 搜索地点
const changeLocal = () => {
  uni.chooseLocation({
    success: (res) => {
      console.log('地点', res)
    },
    fail: () => {},
  })
}
</script>
<template>
  <view class="public">
    <NavHead title="发布行程" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  上传封面图    -->
      <view class="updateCover" @tap="handleUpdateCover" v-if="!cover">
        <view class="title">
          <text class="iconfont icon-tupian" style="margin-right: 8rpx"></text>
          <text>上传封面图片</text>
        </view>
        <view class="text">支持JPG、PNG格式，文件大小不超过2.5MB</view>
      </view>
      <!--  预览图   -->
      <view class="cover" v-else @tap="handleUpdateCover">
        <image :src="cover" mode="widthFix"></image>
        <view class="cover-mask">
          <text class="iconfont icon-tupian"></text>
          <text>点击更换</text>
        </view>
      </view>
      <!--  表单内容  -->
      <view class="formCard">
        <uni-forms ref="formRef" :modelValue="formData" labelWidth="160rpx">
          <!-- 行程主题 -->
          <uni-forms-item label="行程主题" name="title">
            <uni-easyinput
              v-model="formData.title"
              :inputBorder="false"
              placeholder="请输入行程主题"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <!-- 行程类型 -->
          <uni-forms-item label="行程类型" name="type">
            <uni-data-select
              v-model="formData.type"
              :localdata="typeOptions"
              placeholder="请选择"
              mode="none"
            ></uni-data-select>
          </uni-forms-item>
          <!-- 行程时间 (预留位置，后期用组件实现) -->
          <uni-forms-item label="行程时间" name="time">
            <!-- TODO: 时间选择组件 -->
          </uni-forms-item>
          <!-- 行程地点 -->
          <uni-forms-item label="行程地点" name="location">
            <view class="location-row">
              <uni-easyinput
                v-model="formData.address_name"
                :inputBorder="false"
                placeholder="请选择行程地点"
                primaryColor="#ffd018"
                disabled
                trim
              />
              <view class="search-btn" @tap="changeLocal">搜索</view>
            </view>
          </uni-forms-item>
          <!-- 行程地址 -->
          <uni-forms-item label="行程地址" name="address">
            <uni-easyinput
              v-model="formData.event_address"
              :inputBorder="false"
              placeholder="请输入行程地址"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <!-- 联系微信 -->
          <uni-forms-item label="联系微信" name="wechat">
            <uni-easyinput
              v-model="formData.wechat"
              :inputBorder="false"
              placeholder="请输入行程联系微信"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <!-- 联系电话 -->
          <uni-forms-item label="联系电话" name="phone">
            <uni-easyinput
              v-model="formData.phone"
              :inputBorder="false"
              placeholder="请输入行程联系电话"
              primaryColor="#ffd018"
              type="number"
              trim
            />
          </uni-forms-item>
          <!-- 人数限制 -->
          <uni-forms-item label="人数限制" name="maxPeople">
            <view class="number-input">
              <uni-easyinput
                v-model="formData.maxPeople"
                :inputBorder="false"
                placeholder="请输入最高人数"
                primaryColor="#ffd018"
                type="number"
                trim
              />
              <text class="unit">人</text>
            </view>
          </uni-forms-item>
          <!-- 男士报名 -->
          <uni-forms-item label="男士报名" name="maleCount">
            <view class="number-input">
              <uni-easyinput
                v-model="formData.maleCount"
                :inputBorder="false"
                placeholder="可手动输入已报名男士数量"
                primaryColor="#ffd018"
                type="number"
                trim
              />
              <text class="unit">人</text>
            </view>
          </uni-forms-item>
          <!-- 女士报名 -->
          <uni-forms-item label="女士报名" name="femaleCount">
            <view class="number-input">
              <uni-easyinput
                v-model="formData.femaleCount"
                :inputBorder="false"
                placeholder="可手动输入已报名女士数量"
                primaryColor="#ffd018"
                type="number"
                trim
              />
              <text class="unit">人</text>
            </view>
          </uni-forms-item>
          <!-- 用户报名费用 -->
          <uni-forms-item label="报名费用" name="userFee">
            <uni-easyinput
              v-model="formData.userFee"
              :inputBorder="false"
              placeholder="请输入报名费用"
              primaryColor="#ffd018"
              type="digit"
              trim
            />
          </uni-forms-item>
          <!-- 主理人佣金 -->
          <uni-forms-item label="主理人佣金" name="commission">
            <uni-easyinput
              v-model="formData.commission"
              :inputBorder="false"
              placeholder="请输入主理人佣金"
              primaryColor="#ffd018"
              type="digit"
              trim
            />
          </uni-forms-item>
          <!-- 行程需求 -->
          <uni-forms-item label="行程需求" name="requirement">
            <view class="requirement-row" @tap="handleEditRequirement">
              <text class="requirement-placeholder">去填写</text>
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
      <!-- 行程图片上传 -->
      <view class="contentUpdateImage">
        <view class="contentUpdateImage-header">
          <text>行程图片</text>
          <text class="contentUpdateImage-count">{{ imageValue.length }}/6</text>
        </view>
        <uni-file-picker
          ref="filePickerRef"
          v-model="imageValue"
          fileMediatype="image"
          mode="grid"
          :limit="6"
          :auto-upload="false"
          @select="select"
          @progress="progress"
          @success="success"
          @fail="fail"
        />
        <view class="contentUpdateImage-tip">最多上传6张，支持JPG、PNG格式</view>
      </view>
      <!-- 提交审核 -->
      <view class="submit">
        <view class="submit-btn" @tap="handleSubmit">提交审核</view>
      </view>
      <!-- 底部占位 -->
      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.public {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 内容区域 */
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

  :deep(.uni-forms) {
    .uni-forms-item {
      padding: 24rpx 0;
      margin-bottom: 0;
      border-bottom: 1px solid #f5f5f5;

      .uni-forms-item__label {
        font-size: 28rpx;
        color: $qs-font-title;
        padding: 0;
      }

      .uni-forms-item__content {
        display: flex;
        align-items: center;
      }
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
      .uni-select__input-text {
        font-size: 28rpx;
      }
      .uni-select__input-placeholder {
        color: $qs-font-dec2;
      }
    }
  }
}

/* 地点选择行 */
.location-row {
  flex: 1;
  display: flex;
  align-items: center;

  .search-btn {
    flex-shrink: 0;
    margin-left: 16rpx;
    padding: 8rpx 24rpx;
    background: #ffd018;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: $qs-font-title;
  }
}

/* 数字输入带单位 */
.number-input {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .unit {
    flex-shrink: 0;
    margin-left: 8rpx;
    font-size: 28rpx;
    color: $qs-font-dec2;
  }
}

/* 行程需求行 */
.requirement-row {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .requirement-placeholder {
    padding: 8rpx 24rpx;
    background: #ffd018;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: $qs-font-title;
  }
}

/* 提交审核 */
.submit {
  margin-top: 40rpx;
  padding: 0 24rpx;

  .submit-btn {
    width: 309rpx;
    height: 87rpx;
    line-height: 87rpx;
    margin: 0 auto;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    color: $qs-font-title;
    background: $qs-brandColor;
    border-radius: 44rpx;
  }
}

/* 图片上传区域 */
.contentUpdateImage {
  margin-top: 24rpx;
  padding: 24rpx;
  border-bottom: 1px solid #f5f5f5;

  .contentUpdateImage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: $qs-font-title;
    margin-bottom: 20rpx;

    .contentUpdateImage-count {
      font-size: 24rpx;
      color: $qs-font-dec2;
    }
  }

  .contentUpdateImage-tip {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: $qs-font-dec2;
  }

  :deep(.file-picker__box) {
    border-radius: 12rpx;
  }

  :deep(.file-picker__box-content) {
    border-radius: 12rpx;
  }

  :deep(.is-add) {
    border-radius: 12rpx;
    background-color: #fafafa;
  }

  :deep(.file-picker__progress) {
    border-radius: 0 0 12rpx 12rpx;
  }
}
</style>
