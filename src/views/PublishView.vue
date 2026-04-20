<template>
  <div class="publish-container">
    <el-header>
      <div class="header-content">
        <el-button type="primary" class="return-btn" @click="goBack">
          <el-icon><i-ep-arrow-left /></el-icon>
          返回
        </el-button>
        <h1>信息发布</h1>
      </div>
    </el-header>
    <el-main>
      <div class="publish-form-container">
<<<<<<< HEAD
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                  <el-option label="出售" value="供应" />
                  <el-option label="求购" value="需求" />
                  <el-option label="用工" value="需求" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" type="textarea" rows="4" placeholder="请输入详细描述" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="价格（元）" prop="price">
                <el-input v-model="form.price" placeholder="请输入价格" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系电话" prop="contact">
                <el-input v-model="form.contact" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="所在地区" prop="area">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-select v-model="form.area" placeholder="选择县" style="width: 100%">
                  <el-option label="XX县" value="XX县" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.town" placeholder="选择镇" style="width: 100%">
                  <el-option label="XX镇" value="XX镇" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.village" placeholder="选择村" style="width: 100%">
                  <el-option label="XX村" value="XX村" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="fileList"
              :limit="9"
              multiple
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb，最多9张
                </div>
              </template>
            </el-upload>
            <div v-if="uploadedImages.length" class="image-preview-list">
              <div v-for="(url, idx) in uploadedImages" :key="idx" class="preview-item">
                <img :src="url" alt="预览" />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="submitting">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createPublish } from '@/api/publish'
import { uploadImage } from '@/api/upload'

const router = useRouter()
const formRef = ref(null)
const fileList = ref([])
const uploadedImages = ref([])
const submitting = ref(false)

const goBack = () => router.back()

const form = ref({
  title: '',
  type: '',
  content: '',
  price: '',
  contact: '',
  area: '',
  town: '',
  village: '',
  images: []
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  area: [{ required: true, message: '请选择地区', trigger: 'change' }]
}

const handleFileChange = async (file) => {
  const isImage = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
  const isLt500k = file.raw.size / 1024 < 500
  if (!isImage) return ElMessage.error('只能上传 JPG/PNG 格式的图片')
  if (!isLt500k) return ElMessage.error('图片大小不能超过 500KB')
  try {
    const url = await uploadImage(file.raw)
    form.value.images.push(url)
    uploadedImages.value.push(url)
    ElMessage.success('图片上传成功')
  } catch {
    ElMessage.error('图片上传失败，请重试')
  }
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true
    const requestData = {
      title: form.value.title,
      content: form.value.content,
      type: form.value.type,
      area: `${form.value.area} ${form.value.town} ${form.value.village}`.trim(),
      price: form.value.price,
      contact: form.value.contact,
      images: form.value.images.join(',')
    }
    await createPublish(requestData)
    ElMessage.success('发布成功，待村干部审核')
    resetForm()
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message || '发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formRef.value.resetFields()
  form.value.images = []
  uploadedImages.value = []
  fileList.value = []
}
</script>

<style scoped>
.publish-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
}
.el-header {
  background: white;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f0f0f0;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.el-header h1 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2e7d32;
}
.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}
.publish-form-container {
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.12);
  margin: 30px auto;
  max-width: 800px;
  border: 1px solid #e8f5e9;
  transition: all 0.3s ease;
}

.publish-form-container:hover {
  box-shadow: 0 12px 32px rgba(46, 125, 50, 0.18);
  transform: translateY(-2px);
}

.el-row {
  margin-bottom: 0;
}

.el-form-item {
  margin-bottom: 22px;
}
.upload-demo {
  margin-top: 10px;
}
.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.preview-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* ========== 强制修复返回按钮样式 ========== */
.return-btn,
.return-btn:focus,
.return-btn:active {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
  color: white !important;
}
.return-btn:hover {
  background-color: #60ad5e !important;
  border-color: #60ad5e !important;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
  }
  .el-header h1 {
    font-size: 20px;
  }
  .publish-form-container {
    padding: 20px;
    margin: 20px;
  }
}
</style>