<template>
  <div class="filter-bar">
    <div class="filter-scroll">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-btn"
        :class="{ active: modelValue === filter.value }"
        @click="handleFilterClick(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  filters: {
    type: Array,
    required: true,
    default: () => [
      { label: '全部', value: 'all' },
      { label: '供应', value: 'supply' },
      { label: '需求', value: 'demand' }
    ]
  },
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleFilterClick = (value) => {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}
</script>

<style scoped>
.filter-bar {
  background: transparent;
  padding: 0 0 16px 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.filter-scroll {
  display: flex;
  gap: 12px;
  white-space: nowrap;
}

.filter-btn {
  padding: 8px 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-btn:active {
  transform: scale(0.96);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .filter-bar {
    padding: 0 0 12px 0;
  }
  
  .filter-btn {
    padding: 6px 16px;
    font-size: 13px;
  }
}
</style>