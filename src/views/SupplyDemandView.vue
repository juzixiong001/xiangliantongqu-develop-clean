<template>
  <div class="supply-demand-container">
    <el-header>
      <div class="header-content">
        <el-button type="primary" @click="goToHome">
          <el-icon><i-ep-arrow-left /></el-icon>
          返回
        </el-button>
        <h1>供需大厅</h1>
      </div>
    </el-header>
    <el-main>
      <div class="filter-bar">
        <el-select v-model="filter.type" placeholder="选择类型">
          <el-option label="全部" value="" />
          <el-option label="供应" value="supply" />
          <el-option label="需求" value="demand" />
        </el-select>
        <el-select v-model="filter.area" placeholder="选择地区">
          <el-option label="全部" value="" />
          <el-option label="XX县" value="XX县" />
          <el-option label="XX镇" value="XX镇" />
          <el-option label="XX村" value="XX村" />
        </el-select>
        <el-input v-model="filter.keyword" placeholder="搜索关键词" clearable>
          <template #append>
            <el-button @click="search">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      <div v-else-if="filteredItems.length === 0" class="empty-container">
        <el-empty description="暂无供需信息" />
      </div>
      <div v-else class="card-grid">
        <el-card v-for="item in filteredItems" :key="item.id" class="info-card">
          <template #header>
            <div class="card-header">
              <h3>{{ item.title }}</h3>
              <div class="card-actions">
                <el-icon class="favorite-icon" @click.stop="toggleFavorite(item)">
                  <i-ep-star :style="{ color: item.isFavorited ? '#ff8f00' : '#ccc' }" />
                </el-icon>
                <el-tag :type="getTagType(item.type)">
                  {{ item.type === 'supply' ? '供应' : item.type === 'demand' ? '需求' : item.type }}
                </el-tag>
              </div>
            </div>
          </template>
          <div class="card-content">
            <p class="area">{{ item.area || item.village || '未知地区' }}</p>
            <p class="description">{{ item.description }}</p>
            <p class="contact">联系电话：{{ item.contact }}</p>
            <p class="time">发布时间：{{ item.time || formatTime(item.createdAt) }}</p>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSupplyList, searchSupply } from '@/api/supply'
import { addFavorite, removeFavorite, getMyFavorites } from '@/api/favorite'

const router = useRouter()

const filter = ref({
  type: '',
  area: '',
  keyword: ''
})

const loading = ref(false)
const items = ref([])

// 获取供需列表
const fetchSupplyList = async () => {
  loading.value = true
  try {
    const data = await getSupplyList()
    items.value = (data.list || []).map(item => ({
      ...item,
      isFavorited: false,
      favoriteId: null
    }))
  } catch (error) {
    console.error('获取供需列表失败:', error)
    ElMessage.error('获取供需列表失败')
    items.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const search = async () => {
  loading.value = true
  try {
    const params = {
      title: filter.value.keyword,
      content: filter.value.keyword,
      type: filter.value.type === 'supply' ? '供应' : filter.value.type === 'demand' ? '需求' : ''
    }
    const data = await searchSupply(params)
    items.value = (data.list || []).map(item => ({
      ...item,
      isFavorited: false,
      favoriteId: null
    }))
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
    items.value = []
  } finally {
    loading.value = false
  }
}

// 加载收藏状态
const loadFavoritesStatus = async () => {
  try {
    const res = await getMyFavorites()
    const favoriteMap = new Map() // targetId -> favoriteId
    ;(res.list || []).forEach(item => {
      if (item.type === 'supply') {
        favoriteMap.set(item.targetId, item.id)
      }
    })
    items.value.forEach(item => {
      const favoriteId = favoriteMap.get(item.id)
      item.isFavorited = !!favoriteId
      item.favoriteId = favoriteId || null
    })
  } catch (err) {
    console.error('获取收藏状态失败', err)
  }
}

// 切换收藏
const toggleFavorite = async (item) => {
  try {
    if (item.isFavorited) {
      await removeFavorite(item.favoriteId)
      item.isFavorited = false
      item.favoriteId = null
      ElMessage.success('已取消收藏')
    } else {
      const res = await addFavorite({ targetId: item.id, type: 'supply' })
      item.isFavorited = true
      item.favoriteId = res.id   // 根据后端返回的字段名调整
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('收藏操作失败', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 筛选
const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    // 类型筛选
    if (filter.value.type !== '') {
      const typeMap = {
        'supply': '供应',
        'demand': '需求'
      }
      if (item.type !== typeMap[filter.value.type]) {
        return false
      }
    }
    if (filter.value.area !== '' && (!item.area || !item.area.includes(filter.value.area))) return false
    if (filter.value.keyword !== '') {
      const keyword = filter.value.keyword.toLowerCase()
      const titleMatch = item.title && item.title.toLowerCase().includes(keyword)
      const descMatch = item.content && item.content.toLowerCase().includes(keyword)
      if (!titleMatch && !descMatch) {
        return false
      }
    }
    return true
  })
  return result
})

const getTagType = (type) => {
  switch (type) {
    case '供应': return 'success'
    case '需求': return 'danger'
    default: return ''
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const goToHome = () => router.push('/')
const viewDetail = (item) => router.push(`/supply-detail/${item.id}`)

onMounted(async () => {
  await fetchSupplyList()
  await loadFavoritesStatus()
})
</script>

<style scoped>
.supply-demand-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
  padding-bottom: 20px;
}
.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px 0;
}
.el-header {
  background: white;
  color: #333;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f0f0f0;
}
.el-header h1 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2e7d32;
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
.filter-bar {
  display: flex;
  gap: 30px;
  margin: 30px 0;
  padding: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.12);
  align-items: center;
  border: 1px solid #e8f5e9;
  transition: all 0.3s ease;
}

.filter-bar:hover {
  box-shadow: 0 12px 32px rgba(46, 125, 50, 0.18);
  transform: translateY(-2px);
}
.filter-bar .el-select,
.filter-bar .el-input {
  min-width: 220px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}
.info-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}
.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #2e7d32;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}
.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.favorite-icon {
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;
}
.favorite-icon:hover {
  transform: scale(1.1);
}
.card-content {
  padding: 20px;
}
.area, .contact, .time {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}
.area::before { content: '📍'; margin-right: 6px; }
.contact::before { content: '📞'; margin-right: 6px; color: #2e7d32; }
.time::before { content: '🕒'; margin-right: 6px; }
.description {
  margin-bottom: 16px;
  line-height: 1.6;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (max-width: 768px) {
  .filter-bar { flex-direction: column; align-items: stretch; gap: 15px; padding: 20px; }
  .card-grid { grid-template-columns: 1fr; }
}
</style>