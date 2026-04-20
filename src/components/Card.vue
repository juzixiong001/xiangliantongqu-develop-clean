<template>
  <div class="card" @click="handleClick">
    <!-- 图片区域 -->
    <div class="card-image" v-if="data.images && data.images.length">
      <img :src="data.images[0]" :alt="data.title" />
      <span class="image-count" v-if="data.images.length > 1">
        {{ data.images.length }}图
      </span>
    </div>
    <div class="card-image-placeholder" v-else>
      <span>📷</span>
    </div>
    
    <!-- 内容区域 -->
    <div class="card-content">
      <div class="card-header">
        <span class="card-type" :class="typeClass">
          {{ typeText }}
        </span>
        <span class="card-status" v-if="data.status === 'urgent'">
          紧急
        </span>
      </div>
      
      <h3 class="card-title">{{ data.title }}</h3>
      
      <div class="card-desc" v-if="data.description">
        {{ data.description.slice(0, 60) }}...
      </div>
      
      <div class="card-footer">
        <span class="card-price" v-if="data.price">
          ¥{{ data.price }}
          <span v-if="data.unit">/{{ data.unit }}</span>
        </span>
        <span class="card-location">
          📍 {{ data.location || '未知地区' }}
        </span>
      </div>
      
       <div class="card-meta">
        <div class="seller">
          <span class="avatar">👨‍🌾</span>
          <span>{{ data.contactName?.slice(0, 3) || '农户' }}</span>
        </div>
        <div class="stats">
          <span>🔥 {{ data.views || 0 }}浏览</span>
          <span>❤️ {{ data.likes || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

// 类型文字映射
const typeText = computed(() => {
  const map = {
    supply: '供应',
    demand: '需求'
  }
  return map[props.data.type] || '供应'
})

// 类型样式类
const typeClass = computed(() => {
  return props.data.type === 'supply' ? 'type-supply' : 'type-demand'
})

const handleClick = () => {
  emit('click', props.data)
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 图片区域 - 固定高度 */
.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.card-image-placeholder {
  height: 160px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #999;
}

/* 内容区域 - 占满剩余空间 */
.card-content {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-type {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.type-supply {
  background: #e8f5e9;
  color: #2e7d32;
}

.type-demand {
  background: #fff3e0;
  color: #ff8f00;
}

.card-status {
  background: #ffebee;
  color: #f44336;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12px;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff8f00;
}

.card-price span {
  font-size: 13px;
  font-weight: normal;
}

.card-location {
  font-size: 12px;
  color: #999;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.seller {
  display: flex;
  align-items: center;
  gap: 4px;
}

.avatar {
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 12px;
}
</style>