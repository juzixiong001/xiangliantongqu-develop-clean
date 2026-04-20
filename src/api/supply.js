import request from '@/utils/request';

// 获取所有供需列表（支持筛选参数，如 ?category=供应&keyword=苹果）
export function getSupplyList(params) {
  return request.get('/posts', { params });
}

// 获取单个供需详情
export function getSupplyDetail(id) {
  return request.get(`/posts/${id}`);
}

// 搜索供需
export function searchSupply(params) {
  return request.get('/posts/search', { params });
}

// 注意：发布供需、我的发布列表、删除供需已在 publish.js 中实现