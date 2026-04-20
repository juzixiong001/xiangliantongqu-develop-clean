<template>
  <div class="policy-list-container">
    <el-header>
      <div class="header-content">
        <el-button type="primary" @click="goBack">
          <el-icon><i-ep-arrow-left /></el-icon>
          返回
        </el-button>
        <h1>惠农政策</h1>
      </div>
    </el-header>
    <el-main v-loading="loading">
      <!-- 自定义大号切换按钮 -->
      <div class="custom-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'list' }"
          @click="activeTab = 'list'"
        >
          🍎 政策列表
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'match' }"
          @click="activeTab = 'match'"
        >
          🤖 政策匹配
        </button>
      </div>

      <!-- 政策列表 -->
      <div v-if="activeTab === 'list'">
        <!-- 搜索和筛选栏 -->
        <div class="search-filter-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索政策标题、内容.."
            prefix-icon="Search"
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <el-select v-model="selectedArea" placeholder="选择地区" clearable class="area-select" @change="handleAreaChange">
            <el-option label="全国" value="" />
            <el-option label="湖南省" value="湖南" />
            <el-option label="河南省" value="河南" />
            <el-option label="山东省" value="山东" />
            <el-option label="广东省" value="广东" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <!-- 热门政策横向滚动（基于后端数据计算） -->
        <div class="hot-policies" v-if="hotPolicies.length > 0">
          <div class="hot-header">
            <span>🔥 热门政策推荐</span>
            <span class="more" @click="scrollToPolicies">更多 →</span>
          </div>
          <div class="hot-scroll">
            <div
              v-for="policy in hotPolicies"
              :key="policy.id"
              class="hot-card"
              @click="viewPolicy(policy)"
            >
              <h4>{{ policy.title }}</h4>
              <p>{{ policy.summary }}</p>
              <span class="hot-tag">🔥 {{ policy.views || '1.2k' }} 浏览</span>
            </div>
          </div>
        </div>

        <!-- 分类筛选按钮 -->
        <div class="policy-filters-wrapper">
          <div class="policy-filters">
            <button
              v-for="cat in categories"
              :key="cat.value"
              :class="{ active: activeCategory === cat.value }"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- 政策列表 -->
        <div class="policy-list" v-if="filteredPolicies.length > 0">
          <div
            v-for="policy in filteredPolicies"
            :key="policy.id"
            class="policy-item"
            :data-category="policy.category"
            @click="viewPolicy(policy)"
          >
            <div class="policy-header">
              <h3 class="policy-title">{{ policy.title }}</h3>
              <div class="policy-actions">
                <el-icon class="favorite-icon" @click.stop="toggleFavorite(policy)">
                  <i-ep-star :style="{ color: policy.isFavorited ? '#ff8f00' : '#ccc' }" />
                </el-icon>
                <el-tag size="small" :type="getTagType(policy.type)">
                  {{ policy.type || '政策' }}
                </el-tag>
              </div>
            </div>
            <p class="policy-summary">{{ policy.summary }}</p>
            <div class="policy-meta">
              <span class="policy-amount" v-if="policy.money">💰 {{ policy.money }}</span>
              <span class="policy-date">📅 {{ formatDate(policy.createTime) }}</span>
            </div>
          </div>
        </div>

        <EmptyState v-if="filteredPolicies.length === 0 && !loading" text="暂无相关政策" />

        <!-- 简易分页 -->
        <div class="pagination-wrapper" v-if="total > pageSize">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <!-- 政策匹配（增强版：基于后端数据 + 模拟推荐） -->
      <div v-if="activeTab === 'match'" class="match-content">
        <div class="match-header">
          <h2>🤖 智能政策匹配</h2>
          <p>根据您的产业和地区，为您推荐最适合的补贴政策</p>
        </div>

        <!-- 模拟用户信息（后续可从个人资料接口获取） -->
        <div class="user-profile-card">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <span class="label">产业类型</span>
                <span class="value">种植业</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">所在地区</span>
                <span class="value">湖南省</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">经营规模</span>
                <span class="value">50亩</span>
              </div>
            </el-col>
          </el-row>
          <el-button type="primary" size="small" @click="goToPolicyMatch" class="edit-btn">
            完善信息
          </el-button>
        </div>

        <!-- 推荐列表（基于后端政策数据 + 匹配度模拟） -->
        <div class="recommend-list">
          <h3>为您推荐的政策</h3>
          <div
            v-for="policy in matchedPolicies"
            :key="policy.id"
            class="recommend-item"
            @click="viewPolicy(policy)"
          >
            <div class="recommend-header">
              <span class="recommend-title">{{ policy.title }}</span>
              <el-progress
                :percentage="policy.matchScore"
                :color="'#2e7d32'"
                :stroke-width="8"
                style="width: 120px;"
              />
            </div>
            <p class="recommend-summary">{{ policy.summary }}</p>
            <div class="recommend-meta">
              <span>💰 {{ policy.money || '详见政策' }}</span>
              <el-button type="primary" link>查看详情 →</el-button>
            </div>
          </div>
          <EmptyState v-if="matchedPolicies.length === 0" text="暂无匹配政策，请完善信息" />
        </div>

        <div class="match-footer">
          <el-button type="primary" size="large" @click="goToPolicyMatch">
            进入完整匹配系统 <el-icon><i-ep-arrow-right /></el-icon>
          </el-button>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getPolicyList, searchPolicy } from '@/api/policy'
import { addFavorite, removeFavorite, getMyFavorites } from '@/api/favorite'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const route = useRoute()

// 状态
const activeTab = ref('list')
const searchKeyword = ref('')
const selectedArea = ref('')
const activeCategory = ref('all')
const loading = ref(false)
const policies = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 分类数据
const categories = [
  { label: '全部', value: 'all' },
  { label: '种植', value: '种植' },
  { label: '养殖', value: '养殖' },
  { label: '农机', value: '农机' },
  { label: '教育医疗', value: '教育医疗' },
  { label: '就业创业', value: '就业创业' }
]

// 获取政策列表
const fetchPolicies = async (params = {}) => {
  loading.value = true
  try {
    const response = await getPolicyList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...params
    })
    
    const { list, total: totalCount } = response
    total.value = totalCount
    
    // 数据标准化：适配前端字段
    policies.value = list.map(item => normalizePolicy(item))
  } catch (error) {
    console.error('获取政策失败:', error)
    ElMessage.error('获取政策列表失败')
  } finally {
    loading.value = false
  }
}

// 标准化政策数据，补充前端所需字段
const normalizePolicy = (item) => {
  return {
    ...item,
    // 确保关键字段存在
    title: item.title || '未知标题',
    summary: item.content ? item.content.substring(0, 80) + (item.content.length > 80 ? '...' : '') : '暂无摘要',
    money: item.money || '',
    area: item.area || '',
    type: item.type || '其他',
    // 模拟浏览量（后端无此字段时随机生成，用于热门排序）
    views: item.views || Math.floor(Math.random() * 2000 + 500),
    // 用于分类筛选的category字段与type保持一致
    category: item.type || '其他',
    // 格式化日期备用
    createTime: item.createTime || new Date().toISOString().split('T')[0],
    isFavorited: false,     // 初始false，后面loadFavoritesStatus会覆盖
    favoriteId: null
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未知日期'
  return dateStr.split('T')[0] || dateStr
}

// 热门政策（基于浏览量排序取前3）
const hotPolicies = computed(() => {
  return [...policies.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3)
})

// 前端筛选（分类、关键词、地区 —— 同时支持后端搜索，但保留前端筛选作为辅助）
const filteredPolicies = computed(() => {
  let result = policies.value

  // 分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.type === activeCategory.value || p.category === activeCategory.value)
  }

  // 关键词搜索（本地二次过滤，若后端已搜索则基本一致）
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().includes(kw) || 
      (p.content && p.content.toLowerCase().includes(kw))
    )
  }

  // 地区筛选（本地二次过滤）
  if (selectedArea.value) {
    result = result.filter(p => p.area === selectedArea.value || p.area === '全国' || p.area.includes(selectedArea.value))
  }

  return result
})

// 政策匹配推荐（基于当前所有政策模拟，取种植类湖南地区政策）
const matchedPolicies = computed(() => {
  // 从原始数据中过滤（使用policies原始数据，不受分类筛选影响）
  let base = policies.value.filter(p => 
    (p.type === '种植' || p.category === '种植') && 
    (p.area === '湖南' || p.area === '全国' || p.area.includes('湖南'))
  )
  if (base.length === 0) {
    // 降级：取所有政策的前3条并标记匹配度
    base = policies.value.slice(0, 3)
  }
  return base.slice(0, 3).map(p => ({
    ...p,
    matchScore: Math.floor(Math.random() * 25 + 75) // 75-100
  }))
})

// 标签样式
const getTagType = (type) => {
  if (!type) return 'info'
  if (type.includes('种植')) return 'success'
  if (type.includes('养殖')) return 'warning'
  if (type.includes('农机')) return 'primary'
  if (type.includes('教育') || type.includes('医疗')) return 'info'
  if (type.includes('就业') || type.includes('创业')) return ''
  return 'info'
}

// ---------- 收藏相关 ----------
const loadFavoritesStatus = async () => {
  try {
    const res = await getMyFavorites()
    // 假设返回格式：{ list: [{ id: 收藏记录id, targetId: 政策id, type: 'policy' }] }
    const favoriteMap = new Map() // targetId -> favoriteId
    ;(res.list || []).forEach(item => {
      if (item.type === 'policy') {
        favoriteMap.set(item.targetId, item.id)
      }
    })
    policies.value.forEach(policy => {
      const favoriteId = favoriteMap.get(policy.id)
      policy.isFavorited = !!favoriteId
      policy.favoriteId = favoriteId || null
    })
  } catch (err) {
    console.error('获取收藏状态失败', err)
  }
}

const toggleFavorite = async (policy) => {
  try {
    if (policy.isFavorited) {
      await removeFavorite(policy.favoriteId)
      policy.isFavorited = false
      policy.favoriteId = null
      ElMessage.success('已取消收藏')
    } else {
      const res = await addFavorite({ targetId: policy.id, type: 'policy' })
      policy.isFavorited = true
      policy.favoriteId = res.id   // 根据后端返回的实际字段名调整
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('收藏操作失败', error)
    ElMessage.error('操作失败，请重试')
  }
}

// ---------- 搜索和筛选 ----------
const handleSearch = () => {
  currentPage.value = 1
  const params = {}
  if (searchKeyword.value.trim()) {
    params.title = searchKeyword.value.trim()
  }
  if (selectedArea.value) {
    params.area = selectedArea.value
  }
  if (activeCategory.value !== 'all') {
    params.type = activeCategory.value
  }
  fetchPolicies(params).then(() => loadFavoritesStatus())
}

const handleAreaChange = () => {
  // 地区变化时重新搜索
  handleSearch()
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 携带当前筛选条件重新请求
  const params = {}
  if (searchKeyword.value.trim()) params.title = searchKeyword.value.trim()
  if (selectedArea.value) params.area = selectedArea.value
  if (activeCategory.value !== 'all') params.type = activeCategory.value
  fetchPolicies(params).then(() => loadFavoritesStatus())
}

// 监听分类切换（当分类变化时，如果希望触发后端搜索，可调用handleSearch；这里为减少请求，仅做前端过滤，但为了数据完整性，分类变化时可选择重新拉取）
// 为了体验，分类变化时重新请求（确保数据准确）
const handleCategoryChange = () => {
  // 分类变化，重置页码并搜索
  currentPage.value = 1
  handleSearch()
}

// 使用watch监听activeCategory变化
watch(activeCategory, () => {
  if (activeTab.value === 'list') {
    handleCategoryChange()
  }
})

// ---------- 路由跳转 ----------
// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到政策匹配完整页面
const goToPolicyMatch = () => {
  router.push('/policy-match')
}

// 查看政策详情
const viewPolicy = (policy) => {
  router.push(`/policy-detail/${policy.id}`)
}

// 滚动到政策列表
const scrollToPolicies = () => {
  const el = document.querySelector('.policy-list')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// ---------- 生命周期 ----------
onMounted(async () => {
  // 检查登录状态（简单处理）
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    // 可跳转登录，此处仅提示
  }
  
  // 处理路由参数中的分类
  if (route.query.category) {
    activeCategory.value = route.query.category
  }
  
  // 初始加载政策数据
  await fetchPolicies()
  await loadFavoritesStatus()
})
</script>

<style scoped>
/* 保持原有样式不变，新增分页样式和收藏图标样式 */
.policy-list-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
  padding-bottom: 20px;
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
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  gap: 16px;
}

.el-header h1 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2e7d32;
}

.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

/* 自定义大号切换按钮 */
.custom-tabs {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 30px 0 30px;
}

.tab-btn {
  padding: 14px 48px;
  font-size: 20px;
  font-weight: 600;
  border: none;
  background: white;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  letter-spacing: 1px;
}

.tab-btn.active {
  background: linear-gradient(135deg, #2e7d32, #60ad5e);
  color: white;
  box-shadow: 0 8px 20px rgba(46,125,50,0.35);
  transform: translateY(-3px);
}

.tab-btn:hover:not(.active) {
  background: #e8f5e9;
  transform: translateY(-2px);
}

/* 搜索和筛选栏 */
.search-filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 2;
  min-width: 200px;
}

.area-select {
  flex: 1;
  min-width: 150px;
}

/* 热门政策 */
.hot-policies {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.hot-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 18px;
  color: #2e7d32;
}

.more {
  font-size: 14px;
  color: #60ad5e;
  cursor: pointer;
}

.hot-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.hot-card {
  flex: 0 0 280px;
  background: #f9fbe7;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e6f0e6;
}

.hot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(46, 125, 50, 0.12);
}

.hot-card h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #2e7d32;
}

.hot-card p {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hot-tag {
  font-size: 12px;
  color: #ff8f00;
  background: #fff3e0;
  padding: 2px 8px;
  border-radius: 20px;
}

/* 分类筛选 */
.policy-filters-wrapper {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.policy-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.policy-filters button {
  background: white;
  border: 1px solid #c8e6c9;
  border-radius: 30px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
}

.policy-filters button:hover {
  background: #e8f5e9;
  border-color: #2e7d32;
  transform: translateY(-2px);
}

.policy-filters button.active {
  background: linear-gradient(135deg, #2e7d32, #60ad5e);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

/* 政策列表 */
.policy-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.policy-item {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f9fbe7 100%);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8f5e9;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.08);
}

.policy-item:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 20px 40px rgba(46, 125, 50, 0.2);
  border-color: #2e7d32;
}

.policy-item[data-category="种植"] { border-left: 4px solid #2e7d32; }
.policy-item[data-category="养殖"] { border-left: 4px solid #ff8f00; }
.policy-item[data-category="农机"] { border-left: 4px solid #2196f3; }
.policy-item[data-category="教育医疗"] { border-left: 4px solid #9c27b0; }
.policy-item[data-category="就业创业"] { border-left: 4px solid #00bcd4; }

.policy-item::after {
  content: "🍃";
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.15;
  font-size: 24px;
  pointer-events: none;
  transition: opacity 0.3s;
}

.policy-item:hover::after { opacity: 0.3; }

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.policy-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.policy-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.favorite-icon {
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;
}

.favorite-icon:hover {
  transform: scale(1.1);
}

.policy-summary {
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.policy-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.policy-amount {
  color: #ff8f00;
  font-weight: 700;
  font-size: 16px;
  background: #fff8e1;
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
}

.policy-date {
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 政策匹配区域 */
.match-content {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.match-header {
  text-align: center;
  margin-bottom: 32px;
}

.match-header h2 {
  font-size: 28px;
  color: #2e7d32;
  margin-bottom: 12px;
}

.match-header p {
  color: #666;
  font-size: 16px;
}

.user-profile-card {
  background: #f9fbe7;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 32px;
  position: relative;
}

.info-item {
  text-align: center;
  padding: 8px;
}

.info-item .label {
  display: block;
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 18px;
  font-weight: 600;
  color: #2e7d32;
}

.edit-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}

.recommend-list h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.recommend-item {
  background: #f9fbe7;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e6f0e6;
}

.recommend-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(46, 125, 50, 0.12);
}

.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.recommend-title {
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 16px;
}

.recommend-summary {
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommend-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-footer {
  text-align: center;
  margin-top: 32px;
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
  
  .custom-tabs {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .tab-btn {
    width: 200px;
  }
  
  .search-filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .policy-list {
    grid-template-columns: 1fr;
  }
  
  .match-content {
    padding: 20px;
  }
  
  .match-header h2 {
    font-size: 24px;
  }
  
  .user-profile-card {
    padding: 16px;
  }
  
  .info-item .value {
    font-size: 16px;
  }
}
</style>