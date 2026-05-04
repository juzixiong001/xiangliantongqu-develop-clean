<template>
  <div class="login-container">
    <!-- 背景装饰：麦浪线条 + 光晕 -->
    <div class="bg-decoration">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="glow"></div>
    </div>

    <!-- 稻田波浪装饰 -->
    <div class="rice-wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" style="display: block; width: 100%;">
        <path fill="#d4e6c9" fill-opacity="0.5" d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"/>
      </svg>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 左侧插画区（隐藏于移动端） -->
      <div class="illustration">
        <div class="illustration-inner">
          <img src="@/assets/images/login.jpg" class="farmer-illustration-img" alt="丰收小麦" />
          <h3>乡链通衢</h3>
          <p>连接乡村 · 共享机遇</p>
          <div class="small-icons">
            <span>🌾</span>
            <span>🌽</span>
            <span>🍎</span>
          </div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="form-area">
        <div class="form-header">
          <div class="logo">乡链通衢</div>
          <h2>欢迎回来</h2>
          <p>请登录您的账号</p>
        </div>

        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" @submit.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="用户名 / 手机号" 
              prefix-icon="User"
              size="large"
              class="custom-input"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="密码" 
              show-password
              prefix-icon="Lock"
              size="large"
              class="custom-input"
            />
          </el-form-item>
          <div class="form-options">
            <el-checkbox v-model="remember">记住密码</el-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            size="large"
            class="login-btn"
          >
            <span>🌾 登录</span>
          </el-button>
          <div class="register-prompt">
            还没有账号？<a href="#" @click.prevent="goToRegister">立即注册</a>
          </div>
        </el-form>

        <div class="other-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="social-icons">
            <div class="social-icon">📱</div>
            <div class="social-icon">💬</div>
            <div class="social-icon">📧</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>© 2026 乡链通衢 | 助力乡村振兴</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const remember = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名/手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    const response = await login(loginForm.value)
    
    if (!response.token) {
      throw new Error('登录失败：未返回token')
    }
    
    // 根据用户id计算头像索引，确保每个用户id对应唯一的头像
    const userId = response.user.id || 1
    const avatarIndex = (userId % 6) + 1
    const userWithAvatar = {
      ...response.user,
      avatar: `/avatars/avatar${avatarIndex}.png`
    }
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(userWithAvatar))
    if (remember.value) {
      localStorage.setItem('rememberedUser', loginForm.value.username)
    } else {
      localStorage.removeItem('rememberedUser')
    }
    
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

// 自动填充记住的用户名
const rememberedUser = localStorage.getItem('rememberedUser')
if (rememberedUser) {
  loginForm.value.username = rememberedUser
  remember.value = true
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  background: url('@/assets/images/bg.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

/* 半透明遮罩层，保证文字可读 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(245, 247, 240, 0.85);
  z-index: 0;
}

/* 让卡片和底部内容在遮罩上面 */
.login-card,
.footer,
.rice-wave-footer {
  position: relative;
  z-index: 1;
}

/* 背景装饰 - 麦浪线条 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: repeating-linear-gradient( transparent, transparent 48px, rgba(46, 125, 50, 0.08) 48px, rgba(46, 125, 50, 0.08) 52px);
  opacity: 0.5;
}

.wave1 { bottom: 0; height: 100px; background-size: 60px 60px; }
.wave2 { bottom: 30px; height: 80px; opacity: 0.3; background-size: 80px 80px; }
.wave3 { bottom: 60px; height: 60px; opacity: 0.2; background-size: 100px 100px; }

.glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0) 70%);
  border-radius: 50%;
  filter: blur(60px);
}

/* 登录卡片 - 左右布局 */
.login-card {
  display: flex;
  width: 900px;
  margin-top: 60px;      /* 控制顶部距离 */
  margin-bottom: 40px;  /* 与 footer 的间距 */
  max-width: 90vw;
  background: white;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 2;
  backdrop-filter: blur(0px);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

/* 左侧插画区 */
.illustration {
  flex: 1;
  background: linear-gradient(145deg, #e8f5e9 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.illustration-inner {
  text-align: center;
}

.farmer-illustration {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.farmer-illustration-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 24px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.illustration-inner h3 {
  font-size: 28px;
  color: #2e7d32;
  margin: 10px 0;
  font-weight: 600;
}

.illustration-inner p {
  color: #4caf50;
  margin-bottom: 20px;
  font-size: 14px;
}

.small-icons span {
  display: inline-block;
  font-size: 24px;
  margin: 0 8px;
  opacity: 0.7;
}

/* 右侧表单区 */
.form-area {
  flex: 1;
  padding: 48px 40px;
  background: white;
}

.form-header {
  margin-bottom: 32px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #3e2a1f;
  margin: 0 0 8px;
}

.form-header p {
  color: #66bb6a;
  margin: 0;
  font-size: 14px;
}

.custom-input {
  margin-bottom: 8px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 16px;
  background-color: #f1f8e9;
  border: 1px solid #c8e6c9;
  box-shadow: none;
  transition: all 0.2s;
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: #81c784;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 24px;
}

.forgot-link {
  color: #2e7d32;
  text-decoration: none;
  font-size: 13px;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
 background: linear-gradient(135deg, #4caf50, #2e7d32);
  border: none;
  border-radius: 40px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.login-btn:hover {
  background: linear-gradient(135deg, #66bb6a, #1b5e20);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.3);
}

.register-prompt {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #558b2f;
}

.register-prompt a {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;
}

.register-prompt a:hover {
  text-decoration: underline;
}

.other-login {
  margin-top: 32px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider span {
  background: white;
  padding: 0 16px;
  font-size: 12px;
  color: #81c784;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #c8e6c9;
  z-index: -1;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: #f1f8e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #c8e6c9;
}

.social-icon:hover {
  background: #e8f5e9;
  transform: translateY(-3px);
}

/* 页脚 */
.footer {
  margin-top: 40px;
  margin-bottom: 100px;
  font-size: 12px;
  color: #366438;
  z-index: 2;
  width: 100%;
  text-align: center;
}

.rice-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .illustration {
    display: none;
  }
  .login-card {
    width: 90%;
  }
  .form-area {
    padding: 32px 24px;
  }
  .form-header h2 {
    font-size: 24px;
  }
  .rice-wave {
    display: none;
  }
}
</style>