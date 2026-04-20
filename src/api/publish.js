import request from '@/utils/request';

// 获取我的发布列表
export function getMyPublishes() {
  return request.get('/posts/user/publishes');
}

// 删除单条发布
export function deletePublish(id) {
  return request.delete(`/posts/${id}`);
}

// 批量删除发布（ids 为数组，如 [1,2,3]）
export function batchDeletePublishes(ids) {
  return request.delete('/posts', { params: { ids: ids.join(',') } });
}

// 发布新供需
export function createPublish(data) {
  return request.post('/posts', data);
}