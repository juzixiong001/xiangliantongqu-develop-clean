<template>
  <div class="product-detail-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span @click="router.push('/')">首页</span>
      <span>></span>
      <span @click="router.push('/')">秒杀专区</span>
      <span>></span>
      <span class="current">{{ product.name }}</span>
    </div>

    <div class="detail-card">
      <!-- 左侧图片区域 -->
      <div class="product-images">
        <div class="main-image-wrapper">
          <img :src="product.image" :alt="product.name" class="main-image">
        </div>
        <div class="thumb-images">
          <div 
            v-for="(img, index) in product.thumbImages" 
            :key="index"
            class="thumb-item"
            :class="{ active: currentImageIndex === index }"
            @click="currentImageIndex = index"
          >
            <img :src="img" :alt="product.name">
          </div>
        </div>
      </div>
      
      <!-- 右侧信息区域 -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        
        <div class="price-section">
          <div class="seckill-tag">秒杀价</div>
          <span class="seckill-price">￥{{ product.seckillPrice }}</span>
          <span class="original-price">￥{{ product.originalPrice }}</span>
        </div>
        
        <div class="sold-info">
          <span>已售 {{ product.soldCount }}件</span>
          <span>库存 {{ product.stock }}件</span>
          <span>好评率 {{ product.praiseRate }}%</span>
        </div>

        <!-- 配送信息 -->
        <div class="delivery-info">
          <div class="info-item">
            <span class="label">配送</span>
            <span>快递包邮 · 24小时发货</span>
          </div>
          <div class="info-item">
            <span class="label">产地</span>
            <span>{{ product.origin }}</span>
          </div>
          <div class="info-item">
            <span class="label">规格</span>
            <div class="specs">
              <span 
                v-for="spec in product.specs" 
                :key="spec"
                class="spec-tag"
                :class="{ active: selectedSpec === spec }"
                @click="selectedSpec = spec"
              >
                {{ spec }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="cart-btn" @click="handleAddToCart">
            <span>🛒</span> 加入购物车
          </button>
          <button class="buy-btn" @click="handleBuy">立即购买</button>
        </div>
      </div>
    </div>

    <!-- 商品详情标签页 -->
    <div class="detail-tabs">
      <div class="tab-header">
        <span 
          class="tab-item" 
          :class="{ active: activeTab === 'detail' }"
          @click="activeTab = 'detail'"
        >商品详情</span>
        <span 
          class="tab-item" 
          :class="{ active: activeTab === 'comment' }"
          @click="activeTab = 'comment'"
        >用户评价 <span class="count">{{ product.comments?.length || 0 }}</span></span>
      </div>
      
      <div class="tab-content">
        <!-- 商品详情 -->
        <div v-show="activeTab === 'detail'" class="detail-content">
          <div class="description">
            <h3>产品描述</h3>
            <p>{{ product.description }}</p>
          </div>
          <div class="detail-images">
            <img :src="product.detailImage" :alt="product.name" v-if="product.detailImage">
          </div>
        </div>
        
        <!-- 用户评价 -->
        <div v-show="activeTab === 'comment'" class="comment-content">
          <div class="comment-stats">
            <div class="praise-rate">
              <span class="rate">{{ product.praiseRate }}%</span>
              <span>好评率</span>
            </div>
          </div>
          <div class="comment-list">
            <div v-for="(comment, index) in product.comments" :key="index" class="comment-item">
              <div class="comment-user">
                <span class="avatar">👤</span>
                <span class="name">{{ comment.user }}</span>
              </div>
              <div class="comment-content">
                <div class="stars">{{ '★'.repeat(comment.stars) }}{{ '☆'.repeat(5-comment.stars) }}</div>
                <p>{{ comment.content }}</p>
                <span class="time">{{ comment.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 导入自定义图片
// 土鸡蛋
import egg from '@/assets/images/seckill/egg.jpg'
import eggThumb1 from '@/assets/images/seckill/egg_thumb1.jpg'
import eggThumb2 from '@/assets/images/seckill/egg_thumb2.jpg'
import eggThumb3 from '@/assets/images/seckill/egg_thumb3.jpg'
import eggDetail from '@/assets/images/seckill/egg_detail.jpg'

// 有机大米
import rice from '@/assets/images/seckill/rice.jpg'
import riceThumb1 from '@/assets/images/seckill/rice_thumb1.jpg'
import riceThumb2 from '@/assets/images/seckill/rice_thumb2.jpg'
import riceThumb3 from '@/assets/images/seckill/rice_thumb3.jpg'
import riceDetail from '@/assets/images/seckill/rice_detail.jpg'

// 新鲜水果
import fruit from '@/assets/images/seckill/fruit.jpg'
import fruitThumb1 from '@/assets/images/seckill/fruit_thumb1.jpg'
import fruitThumb2 from '@/assets/images/seckill/fruit_thumb2.jpg'
import fruitThumb3 from '@/assets/images/seckill/fruit_thumb3.jpg'
import fruitDetail from '@/assets/images/seckill/fruit_detail.jpg'

// 土蜂蜜
import honey from '@/assets/images/seckill/honey.jpg'
import honeyThumb1 from '@/assets/images/seckill/honey_thumb1.jpg'
import honeyThumb2 from '@/assets/images/seckill/honey_thumb2.jpg'
import honeyThumb3 from '@/assets/images/seckill/honey_thumb3.jpg'
import honeyDetail from '@/assets/images/seckill/honey_detail.jpg'

const route = useRoute()
const router = useRouter()

const currentImageIndex = ref(0)
const selectedSpec = ref('')
const activeTab = ref('detail')

const product = ref({
  id: '',
  name: '',
  seckillPrice: '',
  originalPrice: '',
  soldCount: '',
  stock: '',
  praiseRate: '',
  origin: '',
  specs: [],
  description: '',
  image: '',
  thumbImages: [],
  detailImage: '',
  comments: []
})

// 商品数据（使用本地图片）
const productsMap = {
  1: { 
    name: '农家土鸡蛋', 
    seckillPrice: '1.60', 
    originalPrice: '2.35', 
    soldCount: 1247,
    stock: 8562,
    praiseRate: 98,
    origin: '江西·赣州',
    specs: ['10枚装', '20枚装', '30枚装'],
    description: '精选农家散养土鸡所产鸡蛋，自然放养，以谷物、虫草为食，无激素无添加。蛋黄饱满橙黄，蛋白浓稠，口感香醇，营养丰富。适合孕妇、儿童、老人日常食用。',
    image: egg,
    thumbImages: [eggThumb1, eggThumb2, eggThumb3],
    detailImage: eggDetail,
    comments: [
      { user: '张***', stars: 5, content: '鸡蛋很新鲜，蛋黄很黄，煮出来很香，小孩很喜欢吃！', time: '2026-04-28' },
      { user: '李***', stars: 5, content: '第二次购买了，质量一如既往的好，会继续支持。', time: '2026-04-25' },
      { user: '王***', stars: 4, content: '包装很好，没有破损，就是价格稍微贵了一点。', time: '2026-04-22' }
    ]
  },
  2: { 
    name: '有机大米', 
    seckillPrice: '5.42', 
    originalPrice: '8.99', 
    soldCount: 856,
    stock: 3245,
    praiseRate: 96,
    origin: '黑龙江·五常',
    specs: ['2.5kg', '5kg', '10kg'],
    description: '源自五常核心产区，有机种植标准，不使用化学农药和化肥。米粒晶莹剔透，煮熟后饭香浓郁，口感软糯有嚼劲。富含多种微量元素，是家庭主食的优质选择。',
    image: rice,
    thumbImages: [riceThumb1, riceThumb2, riceThumb3],
    detailImage: riceDetail,
    comments: [
      { user: '陈***', stars: 5, content: '大米很好吃，煮粥煮饭都很香，会回购！', time: '2026-04-27' },
      { user: '林***', stars: 4, content: '口感不错，比超市买的好吃。', time: '2026-04-24' }
    ]
  },
  3: { 
    name: '新鲜水果', 
    seckillPrice: '3.98', 
    originalPrice: '6.50', 
    soldCount: 2341,
    stock: 5210,
    praiseRate: 97,
    origin: '山东·烟台',
    specs: ['3斤装', '5斤装', '8斤装'],
    description: '新鲜采摘的红富士苹果，果实个大均匀，色泽红润。果肉细脆多汁，酸甜适口，富含维生素C和膳食纤维。产地直发，保证新鲜度。',
    image: fruit,
    thumbImages: [fruitThumb1, fruitThumb2, fruitThumb3],
    detailImage: fruitDetail,
    comments: [
      { user: '赵***', stars: 5, content: '苹果很甜很脆，汁水足，非常新鲜！', time: '2026-04-29' },
      { user: '孙***', stars: 5, content: '包装很好，没有磕碰，会再买的。', time: '2026-04-26' }
    ]
  },
  4: { 
    name: '土蜂蜜', 
    seckillPrice: '12.80', 
    originalPrice: '25.00', 
    soldCount: 563,
    stock: 1280,
    praiseRate: 99,
    origin: '四川·青川',
    specs: ['250g', '500g', '1000g'],
    description: '深山土蜂采集百花酿制，一年只取一次蜜。色泽金黄透亮，结晶细腻，花香浓郁。纯天然无添加，具有润肺止咳、美容养颜的功效。',
    image: honey,
    thumbImages: [honeyThumb1, honeyThumb2, honeyThumb3],
    detailImage: honeyDetail,
    comments: [
      { user: '周***', stars: 5, content: '蜂蜜很纯正，每天一杯蜂蜜水，嗓子舒服多了。', time: '2026-04-30' },
      { user: '吴***', stars: 5, content: '味道很好，是真正的土蜂蜜。', time: '2026-04-28' }
    ]
  }
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  const productId = route.params.id
  if (productId && productsMap[productId]) {
    product.value = {
      id: productId,
      ...productsMap[productId]
    }
    if (product.value.specs?.length) {
      selectedSpec.value = product.value.specs[0]
    }
  } else {
    router.push('/')
  }
})

const handleBuy = () => {
  alert(`正在购买 ${product.value.name} ${selectedSpec.value}，请继续操作`)
}

const handleAddToCart = () => {
  alert(`已添加 ${product.value.name} ${selectedSpec.value} 到购物车`)
}
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 20px auto 60px;
  padding: 0 20px;
}

/* 面包屑 */
.breadcrumb {
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
}

.breadcrumb span {
  cursor: pointer;
}

.breadcrumb span:hover:not(.current) {
  color: #2e7d32;
}

.breadcrumb .current {
  color: #333;
  cursor: default;
}

/* 商品卡片 */
.detail-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 32px;
}

/* 图片区域 */
.main-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 16px;
  background: #f5f5f5;
  margin-bottom: 16px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-images {
  display: flex;
  gap: 12px;
}

.thumb-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item.active {
  border-color: #2e7d32;
}

/* 商品信息 */
.product-info h1 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 12px;
}

.seckill-tag {
  background: #ff5722;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.seckill-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff5722;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.sold-info {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 12px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #666;
}

.delivery-info {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  padding: 8px 0;
  font-size: 14px;
}

.info-item .label {
  width: 60px;
  color: #999;
}

.specs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.spec-tag {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.spec-tag:hover,
.spec-tag.active {
  border-color: #2e7d32;
  background: #2e7d32;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.cart-btn, .buy-btn {
  flex: 1;
  padding: 14px 20px;
  border-radius: 40px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cart-btn {
  background: #f5f5f5;
  color: #333;
}

.cart-btn:hover {
  background: #e8e8e8;
}

.buy-btn {
  background: #2e7d32;
  color: white;
}

.buy-btn:hover {
  background: #1b5e20;
  transform: translateY(-2px);
}

/* 标签页 */
.detail-tabs {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}

.tab-item {
  padding: 16px 32px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
  position: relative;
}

.tab-item.active {
  color: #2e7d32;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2e7d32;
}

.tab-item .count {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}

.tab-content {
  padding: 32px;
}

.description {
  line-height: 1.8;
  color: #555;
}

.description h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}

.detail-images {
  margin-top: 24px;
}

.detail-images img {
  width: 100%;
  border-radius: 16px;
}

/* 评价区域 */
.comment-stats {
  text-align: center;
  padding: 24px;
  background: #fafafa;
  border-radius: 16px;
  margin-bottom: 24px;
}

.praise-rate .rate {
  font-size: 48px;
  font-weight: bold;
  color: #2e7d32;
}

.praise-rate span {
  display: block;
  font-size: 14px;
  color: #666;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.comment-user {
  text-align: center;
  min-width: 80px;
}

.avatar {
  font-size: 32px;
}

.name {
  font-size: 12px;
  color: #999;
  display: block;
}

.comment-content {
  flex: 1;
}

.stars {
  color: #ffb800;
  margin-bottom: 8px;
}

.comment-content p {
  margin-bottom: 8px;
  color: #555;
  line-height: 1.6;
}

.time {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .detail-card {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px;
  }
  
  .tab-item {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .thumb-item {
    width: 60px;
    height: 60px;
  }
}
</style>