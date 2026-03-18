<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import { projectAllCateGetApi, projectListFindAllApi } from '@/api/project'
import type { ProjectItem } from '@/types/Project'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 分类映射（_id -> name）
const industryMap = ref<Record<string, string>>({})
const modeMap = ref<Record<string, string>>({})
const scaleMap = ref<Record<string, string>>({})
const initCateMap = async () => {
  const res = await projectAllCateGetApi()
  industryMap.value = Object.fromEntries(res.data.typeList.map((item) => [item._id, item.name]))
  modeMap.value = Object.fromEntries(res.data.modeList.map((item) => [item._id, item.name]))
  scaleMap.value = Object.fromEntries(res.data.scaleList.map((item) => [item._id, item.name]))
}

// 项目列表
const projectList = ref<ProjectItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
const loading = ref(false)
const fetchList = async () => {
  if (finish.value || loading.value) return
  loading.value = true
  try {
    const res = await projectListFindAllApi(pageNum.value, pageSize.value)
    projectList.value.push(...res.data.list)
    if (pageNum.value < res.data.totalPage) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } finally {
    loading.value = false
  }
}

// 获取分类名称
const getIndustryName = (id: string) => industryMap.value[id] ?? '-'
const getModeName = (id: string) => modeMap.value[id] ?? '-'
const getScaleName = (id: string) => scaleMap.value[id] ?? '-'

onLoad(() => {
  initCateMap()
  fetchList()
})

// 加载更多
const handleMore = () => {
  if (!finish.value) fetchList()
}

// 跳转发布
const handleSend = () => {
  uni.navigateTo({
    url: '/pages/project/sendProject',
  })
}

// 跳转项目详情
const handleGoDetail = (item: ProjectItem) => {
  uni.navigateTo({
    url: `/pages/project/projectDetail?projectId=${item._id}`,
  })
}
</script>
<template>
  <view class="project">
    <NavHead title="有趣的项目" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <!--  发布  -->
      <view class="banner" @tap="handleSend">
        <image class="img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/project.png"
          mode="aspectFill"></image>
      </view>
      <!--   title   -->
      <view class="title">
        <NavTitle title="发现有趣的项目"></NavTitle>
      </view>
      <!--  项目列表  -->
      <view class="list" v-if="projectList.length > 0">
        <view class="list-item" v-for="item in projectList" :key="item._id" @tap="handleGoDetail(item)">
          <view class="cover">
            <image mode="aspectFill"
              :src="item.cover || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cover.jpg'">
            </image>
          </view>
          <view class="info">
            <view class="name">{{ item.title }}</view>
            <view class="need">
              <view class="left">
                <view class="row-item" v-if="item.event_address || item.address">
                  <text class="label">所在城市:</text>
                  <text class="value">{{ item.event_address || item.address }}</text>
                </view>
                <view class="row-item">
                  <text class="label">行业类别:</text>
                  <text class="value">{{ getIndustryName(item.industry) }}</text>
                </view>
                <view class="row-item">
                  <text class="label">合作方式:</text>
                  <text class="value">{{ getModeName(item.cooperationMode) }}</text>
                </view>
                <view class="row-item">
                  <text class="label">合作规模:</text>
                  <text class="value">{{ getScaleName(item.cooperationScale) }}</text>
                </view>
              </view>
              <view class="right">
                <view class="checkLook">了解详情</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 空状态 -->
      <view class="empty" v-else-if="!loading">
        <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
          mode="widthFix"></image>
        <text class="empty-text">暂无项目</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.project {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;

  /* 顶部横幅 */
  .banner {
    padding: 0 24rpx;
    margin: 24rpx 0;
    width: 100%;
    height: 240rpx;
    border-radius: 30rpx;

    image {
      border-radius: 30rpx;
    }
  }

  .title {
    padding: 0 24rpx;
    margin-bottom: 24rpx;
    color: $qs-font-title;
    font-weight: bold;
  }

  /* 项目列表 */
  .list {
    padding: 0 24rpx;
    margin-top: 24rpx;

    .list-item {
      display: flex;
      gap: 20rpx;
      padding: 24rpx;
      margin-bottom: 24rpx;
      background-color: $qs-card-bg;
      border-radius: 30rpx;
      @include customShadow();

      /* 封面图 */
      .cover {
        width: 200rpx;
        height: 240rpx;
        border-radius: 10rpx;
        overflow: hidden;
        flex-shrink: 0;
      }

      /* 信息区域 */
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .name {
          margin-bottom: 20rpx;
          font-weight: bold;
          font-size: 28rpx;
          color: $qs-font-title;
          @include ellipsis(1);
        }

        /* 详情区域（左右布局） */
        .need {
          flex: 1;
          display: flex;
          justify-content: space-between;
          margin-top: 10rpx;

          /* 左侧信息行 */
          .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .row-item {
              font-size: 24rpx;
              color: $qs-font-dec;
              @include ellipsis(1);

              .label {
                color: $qs-font-dec2;
              }
            }
          }

          /* 右侧按钮 */
          .right {
            display: flex;
            align-items: flex-end;
            flex-shrink: 0;
            margin-left: 16rpx;

            .checkLook {
              padding: 10rpx 24rpx;
              background-color: $qs-brandColor;
              border-radius: 30rpx;
              font-size: 24rpx;
              color: $qs-font-title;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  /* 空状态 */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;

    .empty-img {
      width: 320rpx;
    }

    .empty-text {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: $qs-font-dec;
    }
  }
}
</style>
