<template>
  <div class="supply-detail-container">
    <el-main>
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else-if="!supply" class="empty-container">
        <el-empty description="暂无详情信息" />
      </div>
      <div v-else class="detail-card">
        <div class="detail-header">
          <h2>{{ supply.title }}</h2>
          <el-tag :type="getTagType(supply.type)">{{ supply.type }}</el-tag>
        </div>
        <div class="detail-content">
          <div class="detail-item">
            <span class="label">地区：</span>
            <span class="value">{{ supply.area }}</span>
          </div>
          <div class="detail-item">
            <span class="label">描述：</span>
            <span class="value">{{ supply.description }}</span>
          </div>
          <div class="detail-item">
            <span class="label">联系电话：</span>
            <span class="value contact">{{ supply.contact }}</span>
          </div>
          <div class="detail-item">
            <span class="label">发布时间：</span>
            <span class="value">{{ supply.time }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" @click="callPhone">拨打电话</el-button>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import supplyData from '../data/supply.json'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const supply = ref(null)

const getSupplyDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    // 这里将来可以替换为真实的API调用
    // const response = await axios.get(`/api/supply/${id}`)
    // supply.value = response.data
    
    // 目前使用本地数据
    supply.value = supplyData.find(item => item.id === parseInt(id))
  } catch (error) {
    console.error('获取供需详情失败:', error)
  } finally {
    loading.value = false
  }
}

const getTagType = (type) => {
  switch (type) {
    case '出售': return 'success'
    case '求购': return 'danger'
    case '用工': return 'primary'
    default: return ''
  }
}

const callPhone = () => {
  if (supply.value) {
    window.location.href = `tel:${supply.value.contact}`
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  getSupplyDetail()
})
</script>

<style scoped>
.supply-detail-container {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.detail-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-top: 30px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 20px;
}

.el-tag {
  border-radius: 20px !important;
  padding: 0 12px !important;
  font-size: 12px !important;
}

.detail-content {
  margin-bottom: 30px;
}

.detail-item {
  margin-bottom: 20px;
}

.detail-item .label {
  font-weight: 600;
  color: #666;
  margin-bottom: 5px;
  display: block;
}

.detail-item .value {
  color: #333;
  line-height: 1.6;
  display: block;
}

.detail-item .contact {
  color: #1677FF;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.action-buttons .el-button {
  border-radius: 8px;
}

.loading-container,
.empty-container {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  margin-top: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .el-header h1 {
    font-size: 24px;
  }
  
  .detail-card {
    padding: 20px;
  }
  
  .detail-header h2 {
    font-size: 20px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-item .label {
    margin-bottom: 5px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .loading-container,
  .empty-container {
    padding: 30px;
  }
}
</style>