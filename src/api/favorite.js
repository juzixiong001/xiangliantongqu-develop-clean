import request from '@/utils/request';

// 添加收藏
export function addFavorite(data) {
  return request.post('/favorites', data);
}

// 取消单个收藏
export function removeFavorite(id) {
  return request.delete(`/favorites/${id}`);
}

// 批量取消收藏（ids 为数组，如 [1,2,3]）
export function batchRemoveFavorites(ids) {
  return request.delete('/favorites', { params: { ids: ids.join(',') } });
}

// 获取我的收藏列表
export function getMyFavorites() {
  return request.get('/user/favorites');
}