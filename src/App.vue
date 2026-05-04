<template>
  <div id="app">
    <router-view />
    
    <ChatBot />

    <!-- 底部导航栏 -->
    <div class="tab-bar">
      <div 
        class="tab-item"
        :class="{ active: $route.path === '/' || $route.path === '/home' }"
        @click="goToHome"
      >
        <span>🏠</span>
        <span>首页</span>
      </div>
      <div 
        class="tab-item"
        :class="{ active: $route.path === '/policy-list' }"
        @click="goToPolicy"
      >
        <span>📋</span>
        <span>政策</span>
      </div>
      <div 
        class="tab-item"
        :class="{ active: $route.path === '/supply-demand' }"
        @click="goToSupply"
      >
        <span>📦</span>
        <span>供需</span>
      </div>
      <div 
        class="tab-item"
        :class="{ active: $route.path === '/my' }"
        @click="goToMy"
      >
        <span>👤</span>
        <span>个人中心</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFontSize } from '@/composables/useFontSize'
import { useRouter } from 'vue-router'
import ChatBot from '@/components/ChatBot.vue'

const { toggleFontSize } = useFontSize()
const router = useRouter()

const goToHome = () => {
  router.push('/home')
}

const goToPolicy = () => {
  router.push('/policy-list')
}

const goToSupply = () => {
  router.push('/supply-demand')
}

// 跳转到个人中心，未登录则跳转到登录页
const goToMy = () => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/my')
  } else {
    router.push('/login')
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #F5F7F0;
}

#app {
  min-height: 100vh;
  /* padding-bottom: 80px; */
}

/* 底部导航栏 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;           /* 确保占满全宽 */
  max-width: 100%;       /* 去掉最大宽度限制 */
  display: flex;
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(100, 150, 100, 0.3);
  padding: 12px 0 20px;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #5c6e5a;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-item span:first-child {
  font-size: 26px;
}

.tab-item span:last-child {
  font-size: 13px;
  font-weight: 500;
}

.tab-item.active {
  color: #2e7d32 !important;
}

.tab-item:hover {
  color: #4caf50 !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tab-bar {
    padding: 10px 0 18px;
  }
  
  .tab-item span:first-child {
    font-size: 24px;
  }
  
  .tab-item span:last-child {
    font-size: 12px;
  }
}
</style>