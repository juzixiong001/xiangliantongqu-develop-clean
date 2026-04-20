// 保存数据到localStorage
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// 从localStorage读取数据
export function loadData(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

// 添加一条新信息
export function addPost(newPost, existingPosts) {
  const updatedPosts = [newPost, ...existingPosts]
  saveData('posts', updatedPosts)
  return updatedPosts
}

// 删除一条信息
export function deletePost(postId, posts) {
  const updatedPosts = posts.filter(post => post.id !== postId)
  saveData('posts', updatedPosts)
  return updatedPosts
}
