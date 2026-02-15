<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'

// 预约须知数据（后续从接口获取）
const noteList = [
  {
    title: '入住时间说明',
    content:
      '入住时间为当日14:00以后，退房时间为次日12:00前。如需提前入住或延迟退房，请提前联系前台确认，视当日房态安排，可能产生额外费用。',
  },
  {
    title: '预订与取消政策',
    content:
      '预订成功后请按时入住。入住前24小时内取消或未按时到店，酒店有权按订单金额收取相应费用，具体以订单页面显示为准。',
  },
]

// 图文详情数据（后续从接口获取）
// type: 'image' 图片 | 'text' 文字
const detailList = [
  {
    type: 'text',
    content:
      '湖景大床房位于酒店主楼高层，拥有绝佳的湖景视野。房间面积约45平方米，配备King Size大床，让您尽享舒适睡眠。',
  },
  {
    type: 'image',
    content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  },
  {
    type: 'text',
    content:
      '房间内设施齐全，配有独立卫浴、智能马桶、雨淋花洒、高速WiFi、55寸智能电视等。落地窗设计，白天可欣赏湖光山色，夜晚可观赏城市夜景。',
  },
  {
    type: 'image',
    content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  },
  {
    type: 'text',
    content: '每日提供免费矿泉水、茶包及咖啡。入住期间可免费使用健身房、游泳池等酒店设施。',
  },
  {
    type: 'image',
    content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  },
]

// 立即兑换
const exchange = () => {
  uni.navigateTo({
    url: '/pagesMember/myScore/exchange',
  })
}
</script>
<template>
  <view class="productDetail">
    <NavHead title="商品详情" :show-back="true"></NavHead>
    <!--  内容区域  -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  封面图  -->
      <view class="cover">
        <image
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
          mode="aspectFill"
        ></image>
      </view>
      <!--  预约信息  -->
      <view class="productInfo">
        <NavTitle title="湖景大床房"></NavTitle>
        <view class="info">
          <!--   价格   -->
          <view class="price">
            <text class="iconfont icon-shijian"></text>
            <view class="value">积分：100积分</view>
          </view>
          <!--   位置和商家名称   -->
          <view class="info-row">
            <view class="info-main">
              <view class="info-title">
                <text class="iconfont icon-dingwei"></text>
                <text class="title-text" style="margin-left: 10rpx">千宿百院</text>
              </view>
              <view class="info-desc">
                武汉市场口区区京汉大道668号恒隆广场场 东区L4层L444号INS室内蹦极
              </view>
            </view>
            <view class="info-action">
              <text class="iconfont icon-ditu" style="color: #f7821a; font-size: 40rpx"></text>
              <view style="font-size: 24rpx; color: #919191">地图</view>
            </view>
          </view>
          <!--   预约流程   -->
          <view class="info-row">
            <view class="info-main">
              <view class="info-title">
                <text class="iconfont icon-shoucang"></text>
                <text class="title-text" style="margin-left: 10rpx">预约流程</text>
              </view>
              <view class="info-desc"> 购买商品→致电商家预约→商家确认→进店消费 </view>
            </view>
            <view class="info-action">
              <text
                class="iconfont icon-dianhuabodadianhua"
                style="color: #f7821a; font-size: 40rpx"
              ></text>
              <view style="font-size: 24rpx; color: #919191">预约</view>
            </view>
          </view>
        </view>
      </view>
      <!--  预约须知  -->
      <view class="note">
        <NavTitle title="预约须知"></NavTitle>
        <view class="note-list">
          <view class="note-item" v-for="(item, index) in noteList" :key="index">
            <view class="note-title">{{ index + 1 }}. {{ item.title }}</view>
            <view class="note-content">{{ item.content }}</view>
          </view>
        </view>
      </view>
      <!--  图文详情    -->
      <view class="detail">
        <view class="detail-content">
          <NavTitle title="图文详情"></NavTitle>
          <view class="detail-list">
            <template v-for="(item, index) in detailList" :key="index">
              <!-- 文字 -->
              <view v-if="item.type === 'text'" class="detail-text">
                {{ item.content }}
              </view>
              <!-- 图片 -->
              <image
                v-else-if="item.type === 'image'"
                :src="item.content"
                mode="widthFix"
                class="detail-img"
              ></image>
            </template>
          </view>
        </view>
      </view>
      <!-- 底部占位，防止内容被操作栏遮挡 -->
      <view class="action-bar-placeholder"></view>
    </scroll-view>
    <!--  底部操作栏  -->
    <view class="action-bar">
      <view class="action-tools">
        <view class="action-tool-item">
          <text class="iconfont icon-erweima action-tool-icon"></text>
          <text class="action-tool-text">进群</text>
        </view>
        <view class="action-tool-item">
          <text class="iconfont icon-kefu action-tool-icon"></text>
          <text class="action-tool-text">客服</text>
        </view>
      </view>
      <view class="action-submit-btn" @tap="exchange">立即兑换</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.productDetail {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  /*封面图*/
  .cover {
    height: 400rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
  /*产品信息*/
  .productInfo {
    margin-top: 20rpx;
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 50rpx;
      padding: 39rpx 37rpx;
      margin-top: 20rpx;
      background: #ffffff;
      border-radius: 20rpx;
      @include customShadow();

      /*价格*/
      .price {
        display: flex;
        align-items: center;
        gap: 10rpx;
        color: $qs-font-title;
        font-weight: bold;
      }
      /*通用信息行*/
      .info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .info-main {
          flex: 1;
          .info-title {
            margin-bottom: 10rpx;
            font-weight: bold;
            color: $qs-font-title;
          }
          .info-desc {
            font-size: 24rpx;
            color: $qs-font-dec;
          }
        }
        .info-action {
          text-align: center;
        }
      }
    }
  }
  /*预约须知*/
  .note {
    padding: 39rpx 37rpx;
    margin-top: 20rpx;
    background: #ffffff;
    border-radius: 20rpx;
    @include customShadow();

    .note-list {
      margin-top: 20rpx;
      display: flex;
      flex-direction: column;
      gap: 30rpx;

      .note-item {
        .note-title {
          font-size: 28rpx;
          font-weight: bold;
          color: $qs-font-title;
          margin-bottom: 12rpx;
        }
        .note-content {
          font-size: 24rpx;
          color: $qs-font-dec;
          line-height: 1.6;
          text-align: justify;
        }
      }
    }
  }

  /*图文详情*/
  .detail {
    margin-top: 20rpx;

    .detail-content {
      padding: 30rpx;
      background: #ffffff;
      border-radius: 20rpx;
      @include customShadow();
      overflow: hidden;

      .detail-list {
        margin-top: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .detail-text {
          font-size: 26rpx;
          color: $qs-font-dec;
          line-height: 1.8;
          text-align: justify;
        }

        .detail-img {
          width: 100%;
          display: block;
          border-radius: 12rpx;
        }
      }
    }
  }
}
/*底部操作栏*/
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx calc(20rpx + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1rpx solid #f0f0f0;
  box-sizing: border-box;

  /* 工具按钮区域 */
  .action-tools {
    display: flex;
    gap: 40rpx;

    .action-tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6rpx;

      .action-tool-icon {
        font-size: 50rpx;
        color: $qs-font-title;
      }

      .action-tool-text {
        font-size: 24rpx;
        color: $qs-font-title;
      }
    }
  }

  /* 提交按钮 */
  .action-submit-btn {
    flex: 1;
    max-width: 360rpx;
    margin-left: 40rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #1a1a1a;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #ffb034;
  }
}

/* 底部操作栏占位 */
.action-bar-placeholder {
  height: calc(130rpx + env(safe-area-inset-bottom));
}
</style>
