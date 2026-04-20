<template>
  <div class="tab-container">
    <div 
      v-for="tab in tabs" 
      :key="tab.value"
      class="tab-item"
      :class="{ active: modelValue === tab.value }"
      @click="handleTabClick(tab.value)"
    >
      {{ tab.label }}
      <div class="tab-indicator" v-if="modelValue === tab.value"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(tab => tab.label && tab.value)
    }
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleTabClick = (value) => {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}
</script>

<style scoped>
.tab-container {
  display: flex;
  background: transparent;
  border-bottom: 2px solid #e8e8e8;
  padding: 0;
  margin-bottom: 20px;
}

.tab-item {
  flex: 0 0 auto;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  position: relative;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-item:hover {
  color: var(--primary-color);
}

.tab-item.active {
  color: var(--primary-color);
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .tab-item {
    flex: 1;
    padding: 12px 0;
  }
}
</style>