<template>
  <div class="policy-detail">
    <div class="container">
      <!-- 头部导航 -->
      <div class="header">
        <el-button @click="goBack" class="back-button" size="large">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>政策详情</h1>
      </div>
      
      <!-- 详情卡片 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <h2 class="title">{{ policyInfo.name }}</h2>
            <el-tag type="primary" effect="dark" size="large" class="amount-tag">
              补贴金额：{{ policyInfo.amount }}
            </el-tag>
          </div>
        </template>
        
        <div class="detail-content">
          <!-- 补贴金额 -->
          <div class="info-section">
            <h3>补贴金额</h3>
            <p class="amount">{{ policyInfo.amount }}</p>
          </div>
          
          <!-- 申请条件 -->
          <div class="info-section">
            <h3>申请条件</h3>
            <ul class="condition-list">
              <li v-for="(condition, index) in policyInfo.conditions" :key="index">
                {{ condition }}
              </li>
            </ul>
          </div>
          
          <!-- 所需材料 -->
          <div class="info-section">
            <h3>所需材料</h3>
            <ul class="material-list">
              <li v-for="(material, index) in policyInfo.materials" :key="index">
                {{ material }}
              </li>
            </ul>
          </div>
          
          <!-- 申请流程 -->
          <div class="info-section">
            <h3>申请流程</h3>
            <div class="process-steps">
              <div v-for="(step, index) in policyInfo.process" :key="index" class="process-step">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">{{ step }}</div>
              </div>
            </div>
          </div>
          
          <!-- 联系方式 -->
          <div class="info-section contact-section">
            <h3>联系方式</h3>
            <p class="contact-info">{{ policyInfo.contact }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 模拟数据
const policyInfo = ref({
  name: '农业种植补贴',
  amount: '每亩500元',
  conditions: [
    '具有当地户籍或在当地连续居住满3年',
    '种植面积达到5亩以上',
    '使用指定的优良品种',
    '按照规定的种植技术进行生产'
  ],
  materials: [
    '身份证复印件',
    '土地承包合同',
    '种植面积证明',
    '购买种子、化肥的发票'
  ],
  process: [
    '向当地村委会提交申请',
    '村委会审核并公示',
    '乡镇政府复审',
    '县农业局审批',
    '发放补贴资金'
  ],
  contact: '咨询电话：12316'
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 模拟加载数据
onMounted(() => {
  const id = route.params.id
  if (id) {
    // 这里可以根据ID从API获取数据
    console.log('Loading policy info with ID:', id)
  }
})
</script>

<style scoped>
.policy-detail {
  min-height: 100vh;
  background-color: #F5F7F0;  /* 改成和首页一样的浅绿色 */
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
  margin-bottom: 30px;
}

.back-button {
  margin-right: 20px;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.detail-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.amount-tag {
  font-size: 16px;
  padding: 8px 16px;
}

.detail-content {
  padding: 30px;
}

.info-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.info-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.info-section h3::before {
  content: '';
  width: 4px;
  height: 18px;
  background-color: #2e7d32;
  margin-right: 10px;
  border-radius: 2px;
}

.amount {
  font-size: 24px;
  font-weight: 600;
  color:  #ff8f00;
  margin: 0;
}

.amount-tag {
  background-color: #2e7d32 !important;  /* 改成绿色 */
  border-color: #2e7d32 !important;
}

.condition-list,
.material-list {
  padding-left: 20px;
  margin: 0;
}

.condition-list li,
.material-list li {
  margin-bottom: 10px;
  color: #666;
  line-height: 1.5;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  color: #666;
  line-height: 1.5;
}

.contact-info {
  color: #2e7d32;
  font-weight: 500;
  margin: 0;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .card-header {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .detail-content {
    padding: 20px;
  }
  
  .info-section h3 {
    font-size: 16px;
  }
  
  .amount {
    font-size: 20px;
  }
}
</style>