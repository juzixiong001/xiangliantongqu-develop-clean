<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">乡链通衢</div>
      <el-menu :default-active="activeIndex" class="nav-menu" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="/">
          <el-icon><i-ep-home /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/supply-demand">
          <el-icon><i-ep-goods /></el-icon>
          <span>供需大厅</span>
        </el-menu-item>
        <el-menu-item index="/policy-list">
          <el-icon><i-ep-document /></el-icon>
          <span>惠农政策</span>
        </el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/login">
          <el-icon><i-ep-switch-button /></el-icon>
          <span>登录</span>
        </el-menu-item>
        <el-menu-item v-else index="/my">
          <el-icon><i-ep-user /></el-icon>
          <span>我的</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    
    <!-- 主标语大横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>乡链通衢，让乡村供需畅通无阻</h1>
        <p>乡村供需互联 & 惠农政策精准推送平台</p>
      </div>
    </div>
    
    <!-- 快捷入口卡片区 -->
<div class="quick-entry">
  <h2>快捷入口</h2>
  <div class="entry-cards">
    <el-card @click="toPublish" class="entry-card">
      <div class="card-img-wrapper">
        <img :src="sellImg" alt="卖东西" class="card-img">
      </div>
      <h3>我要卖东西</h3>
      <p>发布出售信息</p>
    </el-card>
    
    <el-card @click="toBuy" class="entry-card">
      <div class="card-img-wrapper">
        <img :src="buyImg" alt="买东西" class="card-img">
      </div>
      <h3>我要买东西</h3>
      <p>浏览求购信息</p>
    </el-card>
    
    <el-card @click="toEmployment" class="entry-card">
      <div class="card-img-wrapper">
        <img :src="workImg" alt="找用工" class="card-img">
      </div>
      <h3>找用工/服务</h3>
      <p>查看用工信息</p>
    </el-card>
    
    <el-card @click="toPolicyMatch" class="entry-card">
      <div class="card-img-wrapper">
        <img :src="policyMatchImg" alt="政策匹配" class="card-img">
      </div>
      <h3>惠农政策匹配</h3>
      <p>精准匹配补贴</p>
    </el-card>
  </div>
</div>
    
    <!-- 最新供需信息展示区 - 卡片轮播版 -->
    <div class="latest-info">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新供需信息</h2>
        </div>
        <el-carousel :interval="4000" type="card" height="280px" :autoplay="true" :loop="true">
          <el-carousel-item v-for="item in latestItems" :key="item.id">
            <div class="info-card" @click="goToSupplyDetail(item.id)">
              <div class="info-image">
                <img :src="getSupplyImage(item)" :alt="item.title" loading="lazy">
              </div>
              <div class="info-content">
                <div class="info-tag" :class="item.type === '出售' ? 'tag-sell' : 'tag-buy'">{{ item.type }}</div>
                <h3>{{ item.title }}</h3>
                <p class="info-desc">{{ item.description }}</p>
                <div class="info-footer">
                  <span class="info-area"><el-icon><i-ep-location /></el-icon> {{ item.area }}</span>
                  <span class="info-time">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>

        <div class="view-more">
          <el-button type="primary" @click="toSupplyDemand">查看全部供需 <el-icon><i-ep-arrow-right /></el-icon></el-button>
        </div>
      </div>
    </div>
    
    <!-- 热门政策推荐区 -->
    <div class="hot-policies">
      <h2>热门政策推荐</h2>
      <div class="policy-cards">
        <el-card v-for="policy in hotPolicies" :key="policy.id" class="policy-card">
          <h3>{{ policy.name }}</h3>
          <p class="amount">{{ policy.amount }}</p>
          <p class="condition">{{ policy.condition }}</p>
        </el-card>
      </div>
      <div class="policy-footer">
        <el-button type="primary" @click="toPolicyList">查看全部政策</el-button>
      </div>
    </div>
    
    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>乡链通衢是一个专注于乡村供需互联和惠农政策推送的平台，致力于解决农村信息不对称问题。</p>
        </div>
        <div class="footer-section">
          <h3>联系方式</h3>
          <p>电话：12345678900</p>
          <p>邮箱：contact@xiangliantongqu.com</p>
        </div>
        <div class="footer-section">
          <h3>平台功能</h3>
          <p>供需匹配：快速发布和查找农产品、农资需求</p>
          <p>政策查询：便捷获取最新惠农政策信息</p>
          <p>信息发布：免费发布各类农村信息</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 乡链通衢 版权所有</p>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = ref('/')
// 导入本地图片
import potatoImg from '@/assets/images/home/potato.jpg'
import appleImg from '@/assets/images/home/apple.jpg'
import harvesterImg from '@/assets/images/home/harvester.jpg'
import orchardImg from '@/assets/images/home/orchard.jpg'

// 快捷入口图片
import sellImg from '@/assets/images/home/sell.jpg'
import buyImg from '@/assets/images/home/buy.jpg'
import workImg from '@/assets/images/home/work.jpg'
import policyMatchImg from '@/assets/images/home/policy-match.jpg'

// 获取供需图片
const getSupplyImage = (item) => {
  if (item.title.includes('土豆')) return potatoImg
  if (item.title.includes('苹果')) return appleImg
  if (item.title.includes('收割机') || item.title.includes('小麦')) return harvesterImg
  if (item.title.includes('果园') || item.title.includes('采摘')) return orchardImg
  return potatoImg
}
// 检查用户是否已登录
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null
})

const latestItems = ref([
  {
    id: 1,
    title: '500斤自家土豆出售',
    area: 'XX县XX村',
    type: '出售',
    contact: '13800138001',
    time: '2024-01-01 10:00'
  },
  {
    id: 2,
    title: '求购小麦收割机',
    area: 'XX县XX镇',
    type: '求购',
    contact: '13900139001',
    time: '2024-01-02 14:30'
  },
  {
    id: 3,
    title: '招工：果园采摘',
    area: 'XX县XX村',
    type: '用工',
    contact: '13700137001',
    time: '2024-01-03 09:00'
  },
  {
    id: 4,
    title: '1000斤苹果出售',
    area: 'XX县XX镇',
    type: '出售',
    contact: '13600136001',
    time: '2024-01-04 11:00'
  }
])

const hotPolicies = ref([
  {
    id: 1,
    name: '粮食种植补贴',
    amount: '每亩100-200元',
    condition: '种植水稻、玉米等粮食作物'
  },
  {
    id: 2,
    name: '脱贫户教育补助',
    amount: '每学年1000-3000元',
    condition: '脱贫户子女接受教育'
  },
  {
    id: 3,
    name: '农业机械购置补贴',
    amount: '购置金额的30%',
    condition: '购买指定农业机械'
  }
])

const toPublish = () => {
  router.push('/publish')
}

const toBuy = () => {
  router.push('/supply-demand')
}

const toEmployment = () => {
  router.push('/supply-demand')
}

const toPolicyMatch = () => {
  router.push('/policy-list')
}

const toPolicyList = () => {
  router.push('/policy-list')
}

const toSupplyDemand = () => {
  router.push('/supply-demand')
}

const handleMenuSelect = (key) => {
  activeIndex.value = key
  router.push(key)
}
</script>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 15px;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  gap: 10px;  /* 添加 gap */
}

.header:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.el-menu {
  border: none !important;
  border-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.el-menu--horizontal {
  border-bottom: 0 !important;
}

.el-menu--horizontal .el-menu-item {
  border-bottom: 0 !important;
}

.el-menu-item {
  color: #333 !important;
  font-size: 16px;
  font-weight: 500;
  margin: 0 8px;
  transition: all 0.3s ease;
  height: 56px;
  line-height: 56px;
  border-bottom: 2px solid transparent;
  flex-shrink: 0;
}

.el-menu-item:hover {
  color: #2e7d32 !important;
  background-color: #f5f7fa !important;
}

.el-menu-item.is-active {
  color: #2e7d32 !important;
  border-bottom: 2px solid #2e7d32;
  font-weight: bold;
  background-color: transparent !important;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #2e7d32;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-menu {
  width: auto;
}

/* 卡片通用样式（轮播图和网格共用） */
.info-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(46, 125, 50, 0.15);
}

.info-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.info-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.info-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.15));
  pointer-events: none;
}

.info-card:hover .info-image img {
  transform: scale(1.05);
}

.info-content {
  padding: 16px;
  flex: 1;
}

.info-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.tag-sell {
  background: #e8f5e9;
  color: #2e7d32;
}

.tag-buy {
  background: #fff3e0;
  color: #ff8f00;
}

.info-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.info-desc {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #999;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.info-area {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 查看更多按钮 - 和政策按钮一致 */
.view-more {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.view-more .el-button--primary {
  background: linear-gradient(135deg, #2e7d32, #60ad5e) !important;
  border: none !important;
  border-radius: 40px !important;
  padding: 10px 28px !important;
  font-weight: 600;
}
.view-more .el-button--primary:hover {
  background: linear-gradient(135deg, #1b5e20, #2e7d32) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3);
}
/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 15px;
    height: 56px;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .el-menu-item {
    font-size: 14px;
    margin: 0 5px;
    height: 56px;
    line-height: 56px;
  }
}



.banner {
  background: linear-gradient(135deg, #2e7d32 0%, #60ad5e 50%, #8bc34a 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 80px 0;
  margin-bottom: 40px;
  border-radius: 0 0 30px 30px;
}

.banner h1, .banner p {
  color: white;
  position: relative;
  z-index: 2;
}

.banner h1 {
  font-size: 2.5rem;
  line-height: 1.3;
  margin-bottom: 20px;
  font-weight: bold;
}

.banner p {
  font-size: 1rem;
  opacity: 0.9;
}

.quick-entry,
.latest-info,
.hot-policies {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.quick-entry h2,
.latest-info h2,
.hot-policies h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.entry-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.entry-card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 30px 20px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.entry-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

/* 快捷入口图片样式 */
.card-img-wrapper {
  width: 100%;
  height: 140px;
  margin: -20px -20px 16px -20px;
  background: linear-gradient(135deg, #f8faf5, #e8f5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  position: relative;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.card-img-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, transparent, white);
  pointer-events: none;
}

.entry-card:hover .card-img-wrapper {
  transform: scale(1.02);
}

/* 调整卡片内边距 */
.entry-card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 0 0 20px 0;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.entry-card h3 {
  margin: 16px 16px 8px 16px;
  font-size: 1.1rem;
}

.entry-card p {
  margin: 0 16px 16px 16px;
  font-size: 0.8rem;
  color: #888;
}

.sell-icon {
  color: #2e7d32;
}

.buy-icon {
  color: #FFB800;
}

.employment-icon {
  color: #36CFC9;
}

.policy-icon {
  color: #722ED1;
}

.entry-card h3 {
  margin-bottom: 10px;
  color: #303133;
  font-weight: bold;
}

.entry-card p {
  color: #888;
  font-size: 14px;
}

.info-item {
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.info-item h3 {
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}

.info-item .area,
.info-item .type {
  display: inline-block;
  margin-right: 20px;
  color: #666;
  font-size: 14px;
}

.info-item .contact {
  color: #2e7d32;
  margin: 10px 0;
  font-weight: 500;
}

.info-item .time {
  color: #909399;
  font-size: 12px;
}

.policy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.policy-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  background-color: white;
}

.policy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.policy-card h3 {
  margin-bottom: 10px;
  color: #303133;
  font-weight: bold;
}

.policy-card .amount {
  color: #ff8f00;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.policy-card .condition {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.policy-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.footer {
  background-color: #f5f7f0;
  color: #666;
  margin-top: 60px;
  padding: 40px 20px 20px;
  border-top: 1px solid #e0e0e0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.footer-section h3 {
  margin-bottom: 20px;
  font-size: 16px;
  color: #2e7d32;
}

.footer-section p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #999;
}

.footer-bottom p {
  margin: 0;
}

/* ========== 乡村特色增强样式 ========== */

/* 1. 背景纹理 */
.home-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
  padding-bottom: 70px;  /* 新增 */
}

/* 2. Banner 增强 */
.banner {
  background: linear-gradient(135deg, #2e7d32 0%, #60ad5e 50%, #8bc34a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 30px 30px;
  padding: 100px 0;
  box-shadow: 0 10px 30px rgba(46, 125, 50, 0.3);
  animation: bannerPulse 3s ease-in-out infinite alternate;
}

.banner h1, .banner p {
  color: white;
  position: relative;
  z-index: 2;
}

.banner::before {
  content: "🌾🌽🍎🥬🍅";
  position: absolute;
  font-size: 100px;
  opacity: 0.12;
  bottom: -20px;
  right: -20px;
  pointer-events: none;
  white-space: nowrap;
}

.banner::after {
  content: "🚜🌿";
  position: absolute;
  font-size: 70px;
  opacity: 0.1;
  top: 10px;
  left: 10px;
  pointer-events: none;
}

/* 3. 标题装饰 */
.quick-entry h2::before {
  content: "🌾";
  margin-right: 10px;
  font-size: 24px;
}

.latest-info h2::before {
  content: "📢";
  margin-right: 10px;
  font-size: 24px;
}

.hot-policies h2::before {
  content: "📖";
  margin-right: 10px;
  font-size: 24px;
}

/* 4. 卡片增强 */
.entry-card, .policy-card, .info-item {
  border-radius: 20px;
  border: none;
  transition: all 0.3s ease;
}

.entry-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(46, 125, 50, 0.15);
}

.policy-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(46, 125, 50, 0.12);
}

.info-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(46, 125, 50, 0.1);
}

/* 5. 按钮优化 */
.policy-footer .el-button--primary {
  background: linear-gradient(135deg, #2e7d32, #60ad5e) !important;
  border: none !important;
  border-radius: 40px !important;
  padding: 12px 32px !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.policy-footer .el-button--primary:hover {
  background: linear-gradient(135deg, #1b5e20, #2e7d32) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3);
}

/* 6. 轮播卡片优化 */
.el-carousel__item {
  border-radius: 20px;
  overflow: hidden;
}

.info-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
}

/* 7. 页脚优化 - 绿色点缀版 */
/* 页脚 - 与页面背景统一 */
.footer {
  background-color: #F5F7F0 !important;  /* 与页面背景一致 */
  color: #666;
  margin-top: 40px;
  padding: 30px 20px 20px;
  border-top: 1px solid #c8e6c9;  /* 浅绿色上边框，柔和区分 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);  /* 极淡的上阴影 */
}

.footer-section h3 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #2e7d32;
  font-weight: 600;
  position: relative;
  padding-left: 26px;
}

.footer-section:nth-child(1) h3::before {
  content: "🌾";
  position: absolute;
  left: 0;
  top: -2px;
  font-size: 18px;
}

.footer-section:nth-child(2) h3::before {
  content: "📞";
  position: absolute;
  left: 0;
  top: -2px;
  font-size: 16px;
}

.footer-section:nth-child(3) h3::before {
  content: "⚙️";
  position: absolute;
  left: 0;
  top: -2px;
  font-size: 16px;
}

.footer-section p {
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.footer-bottom {
  text-align: center;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #e0e0e0;
  font-size: 11px;
  color: #999;
}

/* 可选：在页脚上方加一条装饰线 */
.footer::before {
  content: "🍃";
  display: block;
  text-align: center;
  font-size: 14px;
  color: #a5d6a7;
  margin-bottom: 20px;
  letter-spacing: 8px;
}


/* 响应式布局 */
@keyframes bannerPulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .nav-menu {
    width: 100%;
    margin-top: 10px;
  }
  
  .banner h1 {
    font-size: 24px;
  }
  
  .banner p {
    font-size: 14px;
  }
  
  .entry-cards {
    grid-template-columns: 1fr;
  }
  
  .policy-cards {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* 隐藏菜单栏底部所有可能的凸起 */
.el-menu::before,
.el-menu::after,
.el-menu--horizontal::before,
.el-menu--horizontal::after {
  display: none !important;
  content: none !important;
}

.el-menu {
  border-bottom: 0 !important;
  border-bottom-width: 0 !important;
}

.el-menu--horizontal {
  border-bottom: 0 !important;
}

.header {
  overflow: hidden;
  height: 56px;
}


</style>