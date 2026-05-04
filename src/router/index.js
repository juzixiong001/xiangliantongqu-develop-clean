import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/supply-demand',
      name: 'supply-demand',
      component: () => import('../views/SupplyDemandView.vue'),
    },
    {
      path: '/supply-detail/:id',
      name: 'supply-detail',
      component: () => import('../views/SupplyDetailView.vue'),
    },
    {
      path: '/policy-list',
      name: 'policy-list',
      component: () => import('../views/PolicyListView.vue'),
    },
    {
      path: '/policy-detail/:id',
      name: 'policy-detail',
      component: () => import('../views/PolicyDetailView.vue'),
    },
    {
      path: '/policy-match',
      name: 'policy-match',
      component: () => import('../views/PolicyMatchView.vue'),
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('../views/PublishView.vue'),
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('../views/MyView.vue'),
    },
    {
      path: '/user-publish',
      name: 'user-publish',
      component: () => import('../views/UserPublishView.vue'),
    },
    {
    path: '/product-detail/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetail.vue')
    },
  ],
})

// 路由守卫
router.beforeEach((to, from) => {
  // 需要认证的路由
  const requiresAuth = ['/my', '/publish', '/user-publish']
  
  // 检查是否需要认证
  if (requiresAuth.includes(to.path)) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，重定向到登录页
      return '/login'
    }
  }
  // 不需要认证的路由，直接访问
  return true
})

export default router