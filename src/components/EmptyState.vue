<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <p class="empty-text">{{ text }}</p>
    <button v-if="showButton" class="empty-btn" @click="$emit('action')">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📭'
  },
  text: {
    type: String,
    default: '暂无数据'
  },
  showButton: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: '去发布'
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-lg);
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.6;
}

.empty-text {
  font-size: var(--font-size-base);
  color: var(--gray-text);
  margin: 0 0 var(--spacing-lg) 0;
}

.empty-btn {
  padding: 8px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.empty-btn:active {
  opacity: 0.8;
}
</style>