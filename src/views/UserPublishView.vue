<template>
  <div class="user-publish">
    <div class="container">
      <!-- 头部导航 -->
      <div class="header">
        <el-button @click="goBack" class="back-button" size="large">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>我的发布</h1>
      </div>
      
      <!-- 发布列表 -->
      <div v-if="publishedItems.length > 0" class="publish-list">
        <el-card v-for="item in publishedItems" :key="item.id" class="publish-card">
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ item.title }}</h3>
              <el-tag :type="getTagType(item.type)">{{ item.typeText }}</el-tag>
            </div>
            <div class="card-body">
              <p class="card-description">{{ item.description }}</p>
              <div class="card-info">
                <span class="info-item">{{ item.area }}</span>
                <span class="info-item">{{ item.time }}</span>
                <span class="info-item phone">{{ item.phone }}</span>
              </div>
            </div>
            <div class="card-actions">
              <el-button type="primary" size="small" @click="viewDetail(item.id)">查看详情</el-button>
              <el-button type="danger" size="small" @click="deleteItem(item.id)">删除</el-button>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="您还没有发布任何供需信息" />
        <el-button type="primary" style="margin-top: 20px" @click="goToPublish">去发布</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 模拟数据
const publishedItems = ref([
  {
    id: 1,
    title: '优质有机蔬菜出售',
    type: 'sell',
    typeText: '出售',
    area: '北京市朝阳区',
    time: '2024-01-15 10:30',
    phone: '13800138000',
    description: '现有大量优质有机蔬菜出售，包括西红柿、黄瓜、茄子等品种，全部采用有机种植方式，无农药、无化肥，品质保证。'
  },
  {
    id: 2,
    title: '求购优质水稻种子',
    type: 'buy',
    typeText: '求购',
    area: '上海市浦东新区',
    time: '2024-01-14 14:20',
    phone: '13900139000',
    description: '求购优质水稻种子，要求产量高、抗倒伏、抗病性强，有意者请联系。'
  },
  {
    id: 3,
    title: '招聘农业工人',
    type: 'hire',
    typeText: '用工',
    area: '广州市天河区',
    time: '2024-01-13 09:15',
    phone: '13700137000',
    description: '招聘农业工人，主要负责蔬菜种植和采摘工作，包吃住，工资面议。'
  }
])

// 根据类型获取标签类型
const getTagType = (type) => {
  switch (type) {
    case 'sell': return 'success'
    case 'buy': return 'warning'
    case 'hire': return 'info'
    default: return 'default'
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 查看详情
const viewDetail = (id) => {
  router.push(`/supply-detail/${id}`)
}

// 去发布页面
const goToPublish = () => {
  router.push('/publish')
}

// 删除发布
const deleteItem = (id) => {
  const index = publishedItems.value.findIndex(item => item.id === id)
  if (index !== -1) {
    publishedItems.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}
</script>

<style scoped>
.user-publish {
  min-height: 100vh;
  background-color: #F5F7F0;  /* 改成浅绿色 */
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;  /* 增加间距 */
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #2e7d32;  /* 绿色标题 */
  margin: 0;
}

.back-button {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
  color: white !important;
}

.back-button:hover {
  background-color: #60ad5e !important;
  border-color: #60ad5e !important;
}

.publish-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.publish-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.publish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 10px;
}

.card-description {
  color: #666;
  line-height: 1.5;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #999;
}

.info-item.phone {
  color: #2e7d32;  /* 绿色 */
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.empty-state .el-button--primary {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

.empty-state .el-button--primary:hover {
  background-color: #60ad5e !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .publish-list {
    grid-template-columns: 1fr;
  }
  
  .card-content {
    padding: 15px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .card-info {
    flex-direction: column;
    gap: 5px;
  }
}
</style>