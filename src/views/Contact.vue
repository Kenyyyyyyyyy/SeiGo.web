<template>
  <div class="contact-container">
    <el-card class="contact-card">
      <template #header>
        <h2 class="form-title">お問い合わせ</h2>
      </template>

      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-position="top"
      >
        <el-form-item label="名前" prop="name">
          <el-input v-model="form.name" maxlength="10" show-word-limit placeholder="お名前を入力してください" />
        </el-form-item>

        <el-form-item label="メールアドレス" prop="email">
          <el-input v-model="form.email" maxlength="30" placeholder="example@mail.com" />
        </el-form-item>

        <el-form-item label="メッセージ" prop="content">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="5" 
            maxlength="1000"
            show-word-limit
            placeholder="メッセージ内容を入力してください" 
          />
        </el-form-item>

        <el-form-item label="検証 (ロボット防止)" prop="captchaAnswer">
          <div class="captcha-wrapper">
            <el-input v-model="form.captchaAnswer" placeholder="答えを入力" class="captcha-input" />
            <div class="captcha-question" @click="fetchCaptcha" title="クリックして更新">
              <span v-if="loadingCaptcha">...</span>
              <span v-else>{{ captchaQuestion }}</span>
            </div>
          </div>
          <p class="captcha-tip">数字をクリックすると更新されます</p>
        </el-form-item>

        <div class="hp-field">
          <input type="text" v-model="honeypot" tabindex="-1" autocomplete="off">
        </div>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm" 
            :loading="loading" 
            :disabled="cooldown > 0"
            class="submit-btn"
          >
            {{ cooldown > 0 ? `${cooldown}秒後に再試行` : '送信する' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const loadingCaptcha = ref(false)
const cooldown = ref(0)
const honeypot = ref('') // 蜜罐字段

// 验证码相关状态
const captchaQuestion = ref('')
const captchaKey = ref('')

const form = reactive({
  name: '',
  email: '',
  content: '',
  captchaAnswer: '' // 用户输入的答案
})

const rules = {
  name: [{ required: true, message: '名前を入力してください', trigger: 'blur' }],
  email: [
    { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
    { type: 'email', message: '有効なメールアドレスを入力してください', trigger: 'blur' }
  ],
  content: [{ required: true, message: '内容を入力してください', trigger: 'blur' }],
  captchaAnswer: [{ required: true, message: '検証コードを入力してください', trigger: 'blur' }]
}

// 获取/刷新验证码
const fetchCaptcha = async () => {
  loadingCaptcha.value = true
  try {
    const res = await axios.get('/api/Message/captcha')
    if (res.data.resultCode === 200) {
      captchaQuestion.value = res.data.resultData.question
      captchaKey.value = res.data.resultData.captchaKey
    }
  } catch (error) {
    ElMessage.error('验证码加载失败')
  } finally {
    loadingCaptcha.value = false
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  if (honeypot.value !== '') {
    ElMessage.success('送信に成功しました！')
    setTimeout(() => router.push('/'), 1000) // 蜜罐触发也进行跳转
    return
  }
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const payload = {
          model: { name: form.name, email: form.email, content: form.content },
          captchaKey: captchaKey.value,
          captchaAnswer: form.captchaAnswer
        }

        const res = await axios.post('/api/Message', payload)
        
        if (res.data.resultCode === 200) {
          ElMessage({
            message: '送信に成功しました！まもなくホームに戻ります...',
            type: 'success',
            duration: 500 // 弹窗停留时间和跳转延迟一致
          })
          
          // 3. 核心修改：延迟 0.5 秒跳转到首页
          setTimeout(() => {
            router.push('/')
          }, 500)

        } else {
          ElMessage.error(res.data.message || 'エラーが発生しました')
          refreshOnFail(res.data.resultCode)
        }
      } catch (error: any) {
        ElMessage.error('サーバーエラーが発生しました')
        fetchCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

const refreshOnFail = (code: number) => {
  fetchCaptcha()
  form.captchaAnswer = ''
  if (code === -114) {
    startCooldown(30) // IP限流冷却
  }
}

const startCooldown = (seconds: number) => {
  cooldown.value = seconds
  const timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

onMounted(() => {
  fetchCaptcha()
})
</script>

<style scoped>
.contact-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-color: #f5f7fa;
  min-height: calc(88vh - 100px);
}

.contact-card {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form-title {
  text-align: center;
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

/* 验证码布局样式 */
.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-question {
  background-color: #eef1f6;
  color: #409eff;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  min-width: 80px;
  text-align: center;
  border: 1px solid #dcdfe6;
  transition: all 0.2s;
}

.captcha-question:hover {
  background-color: #d9ecff;
  border-color: #409eff;
}

.captcha-tip {
  font-size: 12px;
  color: #909399;
  margin: 4px 0 0 0;
}

/* 蜜罐字段样式：彻底对人类隐藏 */
.hp-field {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  z-index: -1;
  overflow: hidden;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
  .contact-container {
    padding: 10px 10px 0px 10px;
  }
}
</style>