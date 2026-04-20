import request from '@/utils/request';

// 注册
export function register(data) {
  return request.post('/register', data);
}

// 登录
export function login(data) {
  return request.post('/login', data);
}

// 获取个人资料
export function getUserProfile() {
  return request.get('/user/profile');
}

// 修改个人资料
export function updateUserProfile(data) {
  return request.put('/user/profile', data);
}