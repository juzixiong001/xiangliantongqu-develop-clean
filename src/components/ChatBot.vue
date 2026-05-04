<template>
  <div class="chatbot-container">
    <div class="chat-toggle" @click="toggleChat">
      <span v-if="!isOpen">💬</span>
      <span v-else>✕</span>
    </div>

    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <span>🤖 云衢小智</span>
        <button class="close-btn" @click="toggleChat">✕</button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]">
          <div class="message-content">{{ msg.content }}</div>
        </div>
        <div v-if="loading" class="message assistant">
          <div class="message-content loading-dots">思考中...</div>
        </div>
      </div>

      <div class="chat-input">
        <input 
          v-model="inputText" 
          @keyup.enter="sendMessage" 
          placeholder="输入您的问题..."
          :disabled="loading"
        />
        <button @click="sendMessage" :disabled="loading">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from '@/utils/request'

const isOpen = ref(false)
const inputText = ref('')
const loading = ref(false)
const messagesContainer = ref(null)

const messages = ref([
  { role: 'assistant', content: '你好！我是乡链通衢的智能助手，可以帮你解答政策问题、查询供需信息、或者指导你使用平台。请问有什么可以帮你的？' }
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const response = await axios.post('/ai/chat', {
      prompt: text
    })
    
    console.log('后端返回完整数据:', response)

    const reply = response.answer || '收到您的提问，正在为您查询...'
    messages.value.push({ role: 'assistant', content: reply })
  } catch (error) {
    console.error('AI接口调用失败:', error)
    messages.value.push({ role: 'assistant', content: '抱歉，当前服务繁忙，请稍后再试。' })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 90px; /* 避开底部导航栏 */
  right: 20px;
  z-index: 1000;
}

.chat-toggle {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2e7d32, #60ad5e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.chat-toggle:hover {
  transform: scale(1.05);
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 360px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.chat-header {
  background: #2e7d32;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #f8faf8;
}

.message {
  margin-bottom: 12px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.message.user .message-content {
  background: #2e7d32;
  color: white;
  border-bottom-right-radius: 2px;
}

.message.assistant .message-content {
  background: white;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 2px;
  color: #333;
}

.chat-input {
  display: flex;
  padding: 8px 12px;
  border-top: 1px solid #e0e0e0;
  background: white;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 14px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #2e7d32;
}

.chat-input button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}

.chat-input button:disabled {
  opacity: 0.6;
}

.loading-dots {
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-window {
    width: 90vw;
    right: -10px;
    height: 450px;
  }
  .chatbot-container {
    right: 10px;
    bottom: 80px;
  }
}
</style>