import request from '@/utils/request';

// 获取政策列表（支持筛选参数，如 ?area=湖南）
export function getPolicyList(params) {
  return request.get('/policies', { params });
}

// 获取政策详情
export function getPolicyDetail(id) {
  return request.get(`/policies/${id}`);
}

// 搜索政策
export function searchPolicy(params) {
  return request.get('/policies/search', { params });
}

// 以下接口可能仅管理员使用，但也可以先封装
// 发布政策
export function createPolicy(data) {
  return request.post('/policies', data);
}

// 修改政策
export function updatePolicy(id, data) {
  return request.put(`/policies/${id}`, data);
}

// 删除单条政策
export function deletePolicy(id) {
  return request.delete(`/policies/${id}`);
}

// 批量删除政策
export function batchDeletePolicies(ids) {
  return request.delete('/policies', { params: { ids: ids.join(',') } });
}