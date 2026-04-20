<template>
  <div class="my-view">
    <!-- 用户信息卡片 -->
    <div class="user-card" v-loading="loading">
      <div class="user-avatar">
        <img :src="userInfo.avatar || defaultAvatar" alt="用户头像" @click="handleAvatarClick">
        <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileChange">
      </div>
      <div class="user-info">
        <h2 class="user-name" @click="goToLogin" style="cursor: pointer;">
          {{ userInfo.username || '未登录' }}
        </h2>
        <p class="user-phone">{{ userInfo.phone || '' }}</p>
        <a href="#" class="edit-profile" @click.prevent="editProfile">编辑资料</a>
      </div>
    </div>

    <!-- 统计数据卡片 -->
    <div class="stats-container">
      <div class="stat-card" @click="activeTab = 'published'">
        <div class="stat-icon">
          <i class="icon-document"></i>
        </div>
        <div class="stat-number">{{ userStats.published || 0 }}</div>
        <div class="stat-label">我的发布</div>
      </div>
      <div class="stat-card" @click="activeTab = 'favorites'">
        <div class="stat-icon">
          <i class="icon-star"></i>
        </div>
        <div class="stat-number">{{ userStats.favorites || 0 }}</div>
        <div class="stat-label">我的收藏</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="icon-eye"></i>
        </div>
        <div class="stat-number">{{ userStats.views || 0 }}</div>
        <div class="stat-label">浏览数</div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧导航 -->
      <div class="sidebar">
        <nav class="side-nav">
          <ul>
            <!-- 功能菜单组 -->
            <li :class="{ active: activeTab === 'published' }" @click="activeTab = 'published'">
              <span class="nav-icon"><i class="icon-document"></i></span>
              <span class="nav-text">我的发布</span>
            </li>
            <li :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">
              <span class="nav-icon"><i class="icon-star"></i></span>
              <span class="nav-text">我的收藏</span>
            </li>
            
            <!-- 分割线 -->
            <li class="divider"></li>
            
            <!-- 设置菜单组 -->
            <li class="setting-item">
              <span class="nav-text">大字体模式</span>
              <el-switch v-model="largeFontMode" size="small" />
            </li>
            <li @click="aboutPlatform">
              <span class="nav-icon"><i class="icon-info"></i></span>
              <span class="nav-text">关于平台</span>
            </li>
            <li class="logout" @click="logout">
              <span class="nav-icon"><i class="icon-logout"></i></span>
              <span class="nav-text">退出</span>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 右侧内容 -->
      <div class="content-area">
        <!-- 我的发布 -->
        <div v-if="activeTab === 'published'" class="published-section">
          <div class="section-header">
            <h3>我的发布</h3>
            <el-button type="primary" @click="goToPublish" class="add-btn">
              <el-icon><i-ep-plus /></el-icon> 发布
            </el-button>
          </div>
          
          <div v-if="userInfo.publishedItems && userInfo.publishedItems.length > 0" class="publish-list">
            <div 
              v-for="item in userInfo.publishedItems" 
              :key="item.id"
              class="publish-item"
            >
              <div class="publish-header">
                <input type="checkbox" class="item-checkbox">
                <h4 class="publish-title">{{ item.title }}</h4>
                <span class="publish-type">{{ item.type === 'supply' ? '供应' : '需求' }}</span>
              </div>
              <div class="publish-content">{{ item.content || item.description }}</div>
              <div class="publish-info">
                <span class="publish-area">{{ item.area || '' }}</span>
                <span class="publish-price" v-if="item.price">¥{{ item.price }}元</span>
              </div>
              <div class="publish-footer">
                <span class="publish-phone">{{ userInfo.phone || '' }}</span>
                <div class="publish-actions">
                  <el-button type="primary" size="small" @click="viewItem(item)">查看</el-button>
                  <el-button type="danger" size="small" @click="deleteItem(item.id)">删除</el-button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>暂无发布内容</h3>
            <p>你还没有发布任何信息哦，点击右上角发布吧～</p>
            <el-button type="primary" @click="goToPublish">立即发布</el-button>
          </div>
        </div>

        <!-- 我的收藏 -->
        <div v-if="activeTab === 'favorites'" class="favorites-section">
          <div class="section-header">
            <h3>我的收藏</h3>
          </div>
          
          <div v-if="userInfo.favoriteItems && userInfo.favoriteItems.length > 0" class="favorite-list">
            <div 
              v-for="item in userInfo.favoriteItems" 
              :key="item.id"
              class="favorite-item"
            >
              <div class="favorite-header">
                <h4 class="favorite-title">{{ item.title }}</h4>
                <span class="favorite-type">{{ item.type === 'policy' ? '政策' : item.type === 'supply' ? '供应' : '需求' }}</span>
              </div>
              <div class="favorite-content">{{ item.content || item.description }}</div>
              <div class="favorite-footer">
                <el-button type="primary" size="small" @click="viewItem(item)">查看</el-button>
                <el-button type="danger" size="small" @click="removeFavoriteItem(item.id, item.type)">取消收藏</el-button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">⭐</div>
            <h3>暂无收藏内容</h3>
            <p>你还没有收藏任何内容，去浏览政策和供需信息吧～</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="500px"
      center
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 关于平台对话框 -->
    <el-dialog
      v-model="aboutDialogVisible"
      title="关于乡链通衢"
      width="500px"
      center
    >
      <div class="about-content">
        <div class="about-logo">🌾</div>
        <h3>乡链通衢</h3>
        <p class="version">版本：1.0.0</p>
        <div class="about-description">
          <p>乡链通衢是一个专注于乡村振兴的信息服务平台，旨在连接城乡资源，促进农业发展。</p>
          <p>平台提供以下功能：</p>
          <ul>
            <li>惠农政策查询与匹配</li>
            <li>农产品供需信息发布与对接</li>
            <li>用户个人中心管理</li>
          </ul>
          <p>我们致力于为农民朋友提供便捷、高效的信息服务，助力乡村振兴战略实施。</p>
        </div>
        <div class="about-copyright">
          <p>© 2026 乡链通衢 版权所有</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="aboutDialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserProfile, updateUserProfile } from '@/api/user'
import { removeFavorite, getMyFavorites } from '@/api/favorite'
import { getMyPublishes, deletePublish } from '@/api/publish'
import { uploadImage } from '@/api/upload'

const router = useRouter()
const loading = ref(false)
const activeTab = ref('published')
const fileInput = ref(null)
const largeFontMode = ref(false)

// 编辑资料相关
const editDialogVisible = ref(false)
const editForm = ref({
  username: '',
  phone: ''
})

// 默认头像（静态头像）
const defaultAvatar = '/avatars/avatar1.png'

// 用户信息
const userInfo = ref({
  username: '',
  phone: '',
  avatar: '',
  publishedItems: [],
  favoriteItems: []
})

// 用户统计
const userStats = ref({
  published: 0,
  favorites: 0,
  views: 0
})

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未知日期'
  return dateStr.split('T')[0] || dateStr
}

// 加载用户信息
const loadUserInfo = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return
    }
    
    // 先从localStorage获取用户信息（包含头像）
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      userInfo.value = {
        ...JSON.parse(storedUser),
        publishedItems: [],
        favoriteItems: []
      }
    } else {
      // 如果localStorage中没有用户信息，使用默认值
      userInfo.value = {
        username: '',
        phone: '',
        avatar: '',
        publishedItems: [],
        favoriteItems: []
      }
    }
    
    // 获取用户基本信息
    try {
      const userResponse = await getUserProfile()
      // 保留本地存储的头像信息
      userInfo.value = {
        ...userResponse,
        avatar: userInfo.value.avatar || userResponse.avatar,
        publishedItems: [],
        favoriteItems: []
      }
    } catch (err) {
      console.error('获取用户基本信息失败:', err)
      // 不显示错误信息，保持页面正常显示
      // 不重置用户信息，保留本地存储的内容
    }
    
    // 获取我的发布
    try {
      const publishResponse = await getMyPublishes()
      userInfo.value.publishedItems = publishResponse.list || []
    } catch (err) {
      console.error('加载我的发布失败:', err)
      // 不显示错误信息，避免干扰用户
      userInfo.value.publishedItems = []
    }
    userStats.value.published = userInfo.value.publishedItems.length
    
    // 获取我的收藏
    try {
      const favoriteResponse = await getMyFavorites()
      userInfo.value.favoriteItems = favoriteResponse.list || []
    } catch (err) {
      console.error('加载我的收藏失败:', err)
      // 不显示错误信息，避免干扰用户
      userInfo.value.favoriteItems = []
    }
    userStats.value.favorites = userInfo.value.favoriteItems.length
    
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 不显示错误信息，保持页面正常显示
  } finally {
    loading.value = false
  }
}

// 打开编辑资料对话框
const editProfile = () => {
  // 填充表单数据
  editForm.value.username = userInfo.value.username || ''
  editForm.value.phone = userInfo.value.phone || ''
  editDialogVisible.value = true
}

// 保存资料修改
const saveProfile = async () => {
  try {
    await updateUserProfile(editForm.value)
    // 更新本地用户信息
    userInfo.value.username = editForm.value.username
    userInfo.value.phone = editForm.value.phone
    ElMessage.success('资料更新成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('更新资料失败:', error)
    ElMessage.error('更新资料失败')
  }
}

//点击“未登录”就会跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 处理头像点击
const handleAvatarClick = () => {
  fileInput.value.click()
}

// 处理文件上传
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const response = await uploadImage(file)
    userInfo.value.avatar = response.url
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    // 不显示错误信息，避免干扰用户
  }
}

// 去发布页面
const goToPublish = () => {
  router.push('/publish')
}

// 查看发布内容
const viewItem = (item) => {
  if (item.type === 'policy') {
    router.push(`/policy-detail/${item.id}`)
  } else {
    router.push(`/supply-detail/${item.id}`)
  }
}

// 编辑发布内容
const editItem = (item) => {
  router.push(`/publish?id=${item.id}`)
}

// 删除发布内容
const deleteItem = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条发布吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deletePublish(id)
    userInfo.value.publishedItems = userInfo.value.publishedItems.filter(item => item.id !== id)
    userStats.value.published = userInfo.value.publishedItems.length
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      // 不显示错误信息，避免干扰用户
    }
  }
}

// 取消收藏
const removeFavoriteItem = async (id, type) => {
  try {
    await removeFavorite(id)
    userInfo.value.favoriteItems = userInfo.value.favoriteItems.filter(item => item.id !== id)
    userStats.value.favorites = userInfo.value.favoriteItems.length
    ElMessage.success('取消收藏成功')
  } catch (error) {
    console.error('取消收藏失败:', error)
    // 不显示错误信息，避免干扰用户
  }
}

// 关于平台
const aboutDialogVisible = ref(false)

const aboutPlatform = () => {
  aboutDialogVisible.value = true
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    localStorage.removeItem('token')
    localStorage.removeItem('user_phone')
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退出登录失败:', error)
      // 不显示错误信息，避免干扰用户
    }
  }
}

// 监听大字体模式
watch(largeFontMode, (newValue) => {
  if (newValue) {
    document.body.classList.add('large-font-mode')
  } else {
    document.body.classList.remove('large-font-mode')
  }
})

// 生命周期
onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
/* 全局样式 */
.my-view {
  min-height: 100vh;
  background-color: #f0f7f0;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 用户信息卡片 */
.user-card {
  background: linear-gradient(135deg, #f8fff8, #e8f5e8);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.user-avatar {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4CAF50;
  transition: all 0.3s ease;
}

.user-avatar img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.2;
}

.user-phone {
  color: #999;
  margin: 0;
  font-size: 14px;
  line-height: 1.2;
}

.edit-profile {
  color: #4CAF50;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
  width: fit-content;
}

.edit-profile:hover {
  color: #388E3C;
  text-decoration: underline;
  transform: translateX(2px);
}

/* 统计数据卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15);
  border-color: #4CAF50;
}

.stat-icon {
  font-size: 32px;
  color: #4CAF50;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-number {
  transform: scale(1.05);
}

.stat-label {
  font-size: 14px;
  color: #999;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-label {
  color: #666;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 30px;
}

/* 左侧导航 */
.sidebar {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.side-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-nav li {
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.side-nav li:hover {
  background-color: #f1f8e9;
  color: #4CAF50;
}

.side-nav li.active {
  background-color: #e8f5e8;
  color: #4CAF50;
  font-weight: 600;
  border-left: 4px solid #4CAF50;
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.side-nav li.active .nav-icon {
  transform: scale(1.1);
}

.setting-item {
  justify-content: space-between;
}

.divider {
  height: 1px;
  background-color: #f0f0f0;
  padding: 0;
  cursor: default;
}

.divider:hover {
  background-color: #f0f0f0;
  color: inherit;
}

.logout {
  margin-top: 10px;
  color: #f44336;
  transition: all 0.3s ease;
}

.logout:hover {
  background-color: #ffebee;
  color: #d32f2f;
  border-left: 4px solid #f44336;
}

.logout .nav-icon {
  color: #f44336;
}

/* 右侧内容 */
.content-area {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.add-btn {
  background-color: #4CAF50;
  border-color: #4CAF50;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background-color: #388E3C;
  border-color: #388E3C;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 发布列表 */
.publish-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.publish-item {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.publish-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #4CAF50;
  transform: translateY(-2px);
}

.publish-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.item-checkbox {
  margin: 0;
  transform: scale(1.2);
}

.publish-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  line-height: 1.4;
}

.publish-type {
  background-color: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.publish-content {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 14px;
}

.publish-info {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.publish-area {
  color: #999;
  font-size: 14px;
}

.publish-price {
  color: #ff6b00;
  font-weight: 700;
  font-size: 16px;
}

.publish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.publish-phone {
  color: #666;
  font-size: 14px;
}

.publish-actions {
  display: flex;
  gap: 10px;
}

.publish-actions .el-button {
  transition: all 0.3s ease;
}

.publish-actions .el-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.publish-actions .el-button--danger:hover {
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.publish-actions .el-button--primary:hover {
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

/* 收藏列表 */
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.favorite-item {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #2196F3;
  transform: translateY(-2px);
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.favorite-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.favorite-type {
  background-color: #2196F3;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.favorite-content {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 14px;
}

.favorite-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.favorite-footer .el-button {
  transition: all 0.3s ease;
}

.favorite-footer .el-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px dashed #e0e0e0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 18px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 600;
}

.empty-state p {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.empty-state .el-button {
  background-color: #4CAF50;
  border-color: #4CAF50;
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.empty-state .el-button:hover {
  background-color: #388E3C;
  border-color: #388E3C;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 大字体模式 */
:global(.large-font-mode) {
  font-size: 18px;
}

:global(.large-font-mode .user-name) {
  font-size: 32px;
}

:global(.large-font-mode .publish-title),
:global(.large-font-mode .favorite-title) {
  font-size: 18px;
}

:global(.large-font-mode .publish-content),
:global(.large-font-mode .favorite-content) {
  font-size: 16px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .my-view {
    padding: 10px;
  }
  
  .user-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 20px;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: 2;
    margin-top: 20px;
  }
  
  .content-area {
    order: 1;
    padding: 20px;
  }
  
  .publish-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .publish-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .publish-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .publish-actions .el-button {
    flex: 1;
  }
}

/* 图标样式 */
.icon-document::before {
  content: '📄';
}

.icon-star::before {
  content: '⭐';
}

.icon-eye::before {
  content: '👁️';
}

.icon-info::before {
  content: 'ℹ️';
}

.icon-logout::before {
  content: '🚪';
}

/* 关于平台对话框样式 */
.about-content {
  text-align: center;
  padding: 20px 0;
}

.about-logo {
  font-size: 48px;
  margin-bottom: 20px;
}

.about-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 10px;
}

.version {
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
}

.about-description {
  text-align: left;
  margin: 20px 0;
  line-height: 1.6;
  color: #666;
}

.about-description p {
  margin-bottom: 10px;
}

.about-description ul {
  margin: 10px 0 15px 20px;
}

.about-description li {
  margin-bottom: 5px;
}

.about-copyright {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  color: #999;
  font-size: 14px;
}
</style>