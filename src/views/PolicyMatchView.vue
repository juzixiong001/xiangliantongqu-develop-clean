<template>
  <div class="policy-match-container">
    <el-header>
      <div class="header-content">
        <el-button type="primary" @click="goBack">
          <el-icon><i-ep-arrow-left /></el-icon>
          返回
        </el-button>
        <h1>惠农政策匹配</h1>
      </div>
    </el-header>
    <el-main>
      <div class="questionnaire-container">
        <el-steps :active="currentStep" finish-status="success">
          <el-step title="身份类型" />
          <el-step title="种植/养殖品类" />
          <el-step title="面积/规模" />
          <el-step title="所在地区" />
          <el-step title="困难身份" />
        </el-steps>

        <div class="step-hint">
        {{  currentStep === 0 ? '📝 请选择您的身份' : 
            currentStep === 1 ? '🌾 请选择您的种植/养殖品类' :
            currentStep === 2 ? '📏 请选择您的面积/规模' :
            currentStep === 3 ? '📍 请选择您所在的地区' :
            currentStep === 4 ? '❤️ 请选择是否有困难身份' : '' }}
        </div>        
        
        <div class="question-content">
          <!-- 第一步：身份类型 -->
          <div v-if="currentStep === 0">
            <h2>请选择您的身份类型</h2>
            <el-radio-group v-model="form.identity">
              <el-radio label="种植户">种植户</el-radio>
              <el-radio label="养殖户">养殖户</el-radio>
              <el-radio label="普通农户">普通农户</el-radio>
              <el-radio label="脱贫户">脱贫户</el-radio>
              <el-radio label="返乡创业人员">返乡创业人员</el-radio>
            </el-radio-group>
          </div>
          
          <!-- 第二步：种植/养殖品类 -->
          <div v-if="currentStep === 1">
            <h2>请选择您的种植/养殖品类</h2>
            <el-checkbox-group v-model="form.categories">
              <el-checkbox label="水稻">水稻</el-checkbox>
              <el-checkbox label="玉米">玉米</el-checkbox>
              <el-checkbox label="茶叶">茶叶</el-checkbox>
              <el-checkbox label="生猪">生猪</el-checkbox>
              <el-checkbox label="牛羊">牛羊</el-checkbox>
            </el-checkbox-group>
          </div>
          
          <!-- 第三步：面积/规模 -->
          <div v-if="currentStep === 2">
            <h2>请选择您的面积/规模</h2>
            <el-radio-group v-model="form.scale">
              <el-radio label="0-1亩">0-1亩</el-radio>
              <el-radio label="1-5亩">1-5亩</el-radio>
              <el-radio label="5亩以上">5亩以上</el-radio>
              <el-radio label="小规模养殖">小规模养殖</el-radio>
            </el-radio-group>
          </div>
          
          <!-- 第四步：所在地区 -->
          <div v-if="currentStep === 3">
            <h2>请选择您的所在地区</h2>
            <el-select v-model="form.area" placeholder="选择县">
              <el-option label="XX县" value="XX县" />
            </el-select>
            <el-select v-model="form.town" placeholder="选择镇" style="margin-left: 10px;">
              <el-option label="XX镇" value="XX镇" />
            </el-select>
            <el-select v-model="form.village" placeholder="选择村" style="margin-left: 10px;">
              <el-option label="XX村" value="XX村" />
            </el-select>
          </div>
          
          <!-- 第五步：困难身份 -->
          <div v-if="currentStep === 4">
            <h2>是否有困难身份？</h2>
            <el-radio-group v-model="form.isDifficult">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </div>
        </div>
        
        <div class="selected-preview" v-if="hasSelectedInfo">
          <div class="preview-title">📋 已选信息</div>
          <div class="preview-tags">
            <span v-if="form.identity" class="preview-tag">👤 {{ form.identity }}</span>
            <span v-for="cat in form.categories" :key="cat" class="preview-tag">🌾 {{ cat }}</span>
            <span v-if="form.scale" class="preview-tag">📏 {{ form.scale }}</span>
            <span v-if="form.isDifficult === '是'" class="preview-tag">❤️ 困难身份</span>
          </div>
        </div>

                <!-- 匹配率进度条 -->
        <div class="match-progress">
          <div class="progress-header">
            <span class="progress-label">📊 匹配完成度</span>
            <span class="progress-value">{{ matchProgress }}%</span>
          </div>
          <el-progress :percentage="matchProgress" :color="'#2e7d32'" :stroke-width="8" :show-text="false" />
          <div class="progress-tip">{{ progressTip }}</div>
        </div>

        <!-- 政策小贴士 -->
        <div class="policy-tips">
          <div class="tips-icon">💡</div>
          <div class="tips-text">
            <el-carousel :interval="4000" height="40px" direction="vertical" :loop="true" :autoplay="true">
              <el-carousel-item>🌾 种植水稻、玉米可申请粮食补贴，每亩100-200元</el-carousel-item>
              <el-carousel-item>🚜 购买指定农机具最高可补贴30%，单台最高5万元</el-carousel-item>
              <el-carousel-item>📚 脱贫户子女教育每年补助1000-3000元</el-carousel-item>
              <el-carousel-item>🏠 返乡创业可申请5000-20000元创业补贴</el-carousel-item>
              <el-carousel-item>🐷 规模化养殖生猪，每头可补贴50-100元</el-carousel-item>
            </el-carousel>
          </div>
        </div>

        <div class="button-group">
          <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
          <el-button v-if="currentStep < 4" type="primary" @click="nextStep">下一步</el-button>
          <el-button v-if="currentStep === 4" type="success" @click="submitForm">一键查询补贴</el-button>
        </div>
      </div>
      
      <!-- 结果弹窗 -->
      <el-dialog v-model="resultVisible" title="匹配结果" width="80%">
        <div class="result-container">
          <h3>符合条件的补贴政策</h3>
          <el-card v-for="policy in matchedPolicies" :key="policy.id" class="policy-card">
            <h4>{{ policy.name }}</h4>
            <p><strong>金额范围：</strong>{{ policy.amount }}</p>
            <p><strong>适用条件：</strong>{{ policy.condition }}</p>
            <p><strong>申请材料：</strong></p>
            <ul>
              <li v-for="(material, index) in policy.materials" :key="index">{{ material }}</li>
            </ul>
            <p><strong>咨询电话：</strong>{{ policy.phone }}</p>
          </el-card>
        </div>
        <template #footer>
          <el-button @click="resultVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
const resultVisible = ref(false)

// 匹配率进度条
const matchProgress = computed(() => {
  let total = 0
  if (form.value.identity) total += 25
  if (form.value.categories && form.value.categories.length > 0) total += 25
  if (form.value.scale) total += 25
  if (form.value.isDifficult) total += 25
  return total
})

// 进度提示文字
const progressTip = computed(() => {
  if (matchProgress.value === 0) return '开始填写，获取精准政策匹配'
  if (matchProgress.value < 50) return '再填写一些信息，匹配会更精准'
  if (matchProgress.value < 100) return '即将完成，马上查看匹配结果'
  return '已完成！点击查询获取补贴政策'
})

// 判断是否有已选信息
const hasSelectedInfo = computed(() => {
  return form.value.identity || form.value.categories.length > 0 || form.value.scale || form.value.isDifficult === '是'
})

const goBack = () => {
  router.back()
}

const form = ref({
  identity: '',
  categories: [],
  scale: '',
  area: '',
  town: '',
  village: '',
  isDifficult: ''
})

const matchedPolicies = ref([
  {
    id: 1,
    name: '粮食种植补贴',
    amount: '每亩100-200元',
    condition: '种植水稻、玉米等粮食作物',
    materials: ['身份证', '土地证明', '种植面积证明'],
    phone: '12345678901'
  },
  {
    id: 2,
    name: '脱贫户教育补助',
    amount: '每学年1000-3000元',
    condition: '脱贫户子女接受教育',
    materials: ['身份证', '脱贫证明', '学籍证明'],
    phone: '12345678902'
  },
  {
    id: 3,
    name: '农业机械购置补贴',
    amount: '购置金额的30%',
    condition: '购买指定农业机械',
    materials: ['身份证', '购机发票', '行驶证'],
    phone: '12345678903'
  }
])

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const submitForm = () => {
  // 模拟匹配逻辑
  resultVisible.value = true
}
</script>

<style scoped>
.policy-match-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
}

.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.el-header {
  background: white;
  color: #333;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.el-header h1 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2e7d32;
}

.header-content .el-button {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
  color: white !important;
}

.header-content .el-button:hover {
  background-color: #60ad5e !important;
  border-color: #60ad5e !important;
}

.questionnaire-container {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 550px;
  display: flex;
  flex-direction: column;
}

.question-content {
  max-width: 800px;
  margin: 40px auto;
  flex: 1;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.question-content {
  margin: 40px 0;
}

.question-content h2 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #303133;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* 按钮颜色 */
.el-button--primary,
.el-button--success {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

.el-button--primary:hover,
.el-button--success:hover {
  background-color: #60ad5e !important;
  border-color: #60ad5e !important;
}

/* 步骤条颜色 */
:deep(.el-step__title.is-finish) {
  color: #2e7d32;
}

:deep(.el-step__line.is-finish) {
  background-color: #2e7d32;
}

:deep(.el-step__icon.is-finish .el-step__icon-inner) {
  color: #2e7d32;
}

:deep(.el-step__icon.is-process) {
  background: #2e7d32;
  border-color: #2e7d32;
}

:deep(.el-step__icon.is-process .el-step__icon-inner) {
  color: white;
}

/* 单选框颜色 */
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #2e7d32;
}

/* 复选框颜色 */
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #2e7d32;
}

.result-container {
  max-height: 500px;
  overflow-y: auto;
}

.policy-card {
  margin-bottom: 20px;
  border-left: 4px solid #2e7d32;
}

.policy-card h4 {
  margin-top: 0;
  color: #303133;
}

.policy-card ul {
  padding-left: 20px;
  margin: 10px 0;
}

.policy-card li {
  margin-bottom: 5px;
}

/* 弹窗按钮 */
.el-dialog .el-button--primary {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

/* ========== 页面美化增强 ========== */

/* 步骤提示样式 */
.step-hint {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #2e7d32;
  background: #e8f5e9;
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  width: auto;
}

/* 选项卡片化 - 更高优先级 */
.questionnaire-container .question-content .el-radio,
.questionnaire-container .question-content .el-checkbox {
  background: #f8f9fa !important;
  padding: 12px 20px !important;
  border-radius: 12px !important;
  margin-right: 12px !important;
  margin-bottom: 12px !important;
  border: 1px solid #e8e8e8 !important;
  transition: all 0.3s ease !important;
  width: auto !important;
  display: inline-flex !important;
  align-items: center !important;
  height: auto !important;
}

.questionnaire-container .question-content .el-radio:hover,
.questionnaire-container .question-content .el-checkbox:hover {
  border-color: #2e7d32 !important;
  background: #f1f8e9 !important;
  transform: translateY(-2px) !important;
}

.questionnaire-container .question-content .el-radio.is-checked,
.questionnaire-container .question-content .el-checkbox.is-checked {
  background: #e8f5e9 !important;
  border-color: #2e7d32 !important;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.15) !important;
}

/* 问题标题美化 */
.question-content h2 {
  margin-bottom: 24px;
  font-size: 20px;
  color: #2e7d32;
  position: relative;
  padding-left: 20px;
}

.question-content h2::before {
  content: "📋";
  position: absolute;
  left: -8px;
  top: -2px;
  font-size: 24px;
  opacity: 0.6;
}

/* 按钮美化 */
.button-group .el-button {
  padding: 10px 28px;
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.button-group .el-button--primary,
.button-group .el-button--success {
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

.button-group .el-button--primary:hover,
.button-group .el-button--success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3);
}

/* 已选信息预览 */
.selected-preview {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 20px 0;
}

.preview-title {
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
  margin-bottom: 8px;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-tag {
  background: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #555;
  border: 1px solid #c8e6c9;
}

/* 匹配率进度条 */
.match-progress {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 20px 0 16px;
  border: 1px solid #e8f5e9;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #2e7d32;
}

.progress-value {
  font-size: 18px;
  font-weight: 700;
  color: #2e7d32;
}

.progress-tip {
  font-size: 12px;
  color: #888;
  margin-top: 10px;
  text-align: center;
}

/* 政策小贴士 */
.policy-tips {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f7ea;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 16px 0 20px;
  border: 1px solid #d4e6c3;
}

.tips-icon {
  font-size: 28px;
}

.tips-text {
  flex: 1;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

/* 覆盖 el-carousel 高度 */
.policy-tips :deep(.el-carousel__container) {
  height: 40px;
}

.policy-tips :deep(.el-carousel__item) {
  display: flex;
  align-items: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .el-header h1 {
    font-size: 20px;
  }
  
  .questionnaire-container {
    padding: 20px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .result-container {
    max-height: 400px;
  }
}
</style>