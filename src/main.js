import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueLazyload from 'vue-lazyload'  // 加这一行

// 导入全局颜色变量和大字体样式
import './styles/variables.css'  // ← 添加这一行

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置懒加载
app.use(VueLazyload, {
  loading: 'https://via.placeholder.com/400x200?text=加载中',
  error: 'https://via.placeholder.com/400x200?text=加载失败'
})

app.use(ElementPlus)
app.use(router)
app.mount('#app')