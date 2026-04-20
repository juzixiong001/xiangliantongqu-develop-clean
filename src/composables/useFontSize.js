import { ref } from 'vue'

const STORAGE_KEY = 'font_large_mode'

export function useFontSize() {
  const isLarge = ref(false)
  
  const initFontSize = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'true') {
      isLarge.value = true
      document.body.classList.add('font-large')
    }
  }
  
  const toggleFontSize = () => {
    isLarge.value = !isLarge.value
    
    if (isLarge.value) {
      document.body.classList.add('font-large')
      localStorage.setItem(STORAGE_KEY, 'true')
    } else {
      document.body.classList.remove('font-large')
      localStorage.setItem(STORAGE_KEY, 'false')
    }
  }
  
  return {
    isLarge,
    initFontSize,
    toggleFontSize
  }
}