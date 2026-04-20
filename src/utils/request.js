import axios from 'axios';
import router from '@/router';

// 使用相对路径作为baseURL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 请求拦截器：发送前带上 token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      // 同时设置两个请求头，看看哪种能被后端接受
      config.headers['token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器（保留）
request.interceptors.response.use(
  (response) => {
    // 检查响应是否有data字段
    if (response.data) {
      // 尝试处理后端返回的标准格式
      if (response.data.code !== undefined) {
        if (response.data.code === 200) {
          return response.data.data;
        } else {
          return Promise.reject(new Error(response.data.message || '请求失败'));
        }
      } else {
        // 如果没有code字段，直接返回响应数据
        return response.data;
      }
    } else {
      // 如果没有data字段，返回响应本身
      return response;
    }
  },
  (error) => {
    console.error('请求错误:', error);
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
      
      // 处理401错误，不跳转到登录页面，只显示错误信息
      if (error.response.status === 401) {
        return Promise.reject(new Error('认证失败，请检查token是否有效'));
      }
      
      return Promise.reject(new Error(`服务器错误: ${error.response.status} - ${error.response.data.message || '未知错误'}`));
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('请求未收到响应:', error.request);
      return Promise.reject(new Error('网络错误: 服务器无响应，请检查网络连接'));
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
      return Promise.reject(new Error(`请求错误: ${error.message}`));
    }
  }
);

export default request;