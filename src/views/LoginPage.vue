<template>
  <div class="login">
    <div class="container">
      <div class="left">
        <div class="brand">
          <el-image style="width: 64px; height: 64px" :src="logoUrl" fit="fit" />
          <h1 class="brand-title">SeiGou AdminLoginPage</h1>
        </div>
        <div class="hero">
          <el-image class="boxbg" :src="boxBgUrl" fit="cover" />
        </div>
      </div>

      <div class="right">
        <el-card class="login-card" shadow="always">
          <h2 class="card-title">系统登录</h2>
          <el-form :model="form" label-width="120px" label-position="top" size="large" class="form" :rules="rules"
            ref="ruleFormRef">
            <el-form-item label="用户名 (邮箱)" prop="userName">
              <el-input v-model="form.userName" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" show-password @keyup.enter="onSubmit(ruleFormRef)" />
            </el-form-item>

            <el-form-item>
              <el-button class="submitBtn" type="primary" :loading="loading" @click="onSubmit(ruleFormRef)">

                登录
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="backBtn" type="default" @click="onBack">
                返回
              </el-button>
            </el-form-item>

          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
// 修改：导入新的 authStore
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
// 实例化 authStore
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/AdminPage')
  }
})

// --- 表单实例 ---
const ruleFormRef = ref<FormInstance>()

// --- 表单数据 ---
const form = reactive({
  userName: '', // 这将被用作 useremail
  password: '',
})

// --- 表单验证规则 ---
const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// --- 状态 ---
const loading = ref(false) // 新增：登录加载状态

// --- 图片路径占位符 ---
const logoUrl = ref('https://element-plus.org/images/element-plus-logo.svg')
const boxBgUrl = ref('/bg.jpg') // 假设 bg.jpg 在 public 目录下


// --- 提交方法 (已重写) ---
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl || loading.value) return // 防止重复提交

  try {
    // 1. 直接 await 验证。如果失败，会抛出错误并进入 catch 块
    await formEl.validate()

    // 2. 如果代码执行到这里，说明验证通过
    loading.value = true // 开始加载

    // 3. 单独的 try/finally 块处理 API 调用
    try {
      const success = await authStore.login({
        useremail: form.userName,
        userpwd: form.password,
      })

      if (success) {
        ElMessage.success('登录成功！')
        router.push('/AdminPage') // 跳转到你的后台页面
      } else {
        ElMessage.error('登录失败，请检查用户名或密码。')
      }
    } catch (apiError) {
      ElMessage.error('登录时发生意外错误。')
      console.error(apiError)
    } finally {
      loading.value = false // 无论 API 成功或失败，都结束加载
    }

  } catch (validationError) {
    // 4. 如果验证失败，会在这里捕获
    ElMessage.error('请正确填写表单。')
    console.log('表单验证失败:', validationError)
  }
}

const onBack = () => {
  router.back(); 
};

</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  /* 覆盖原来的 100% 更可靠 */
  width: 100%;
  display: flex;
  align-items: stretch;
}

.container {
  flex: 1;
  width: 100%;
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  /* 大屏并排，窄屏改为换行 */
  align-items: stretch;
  gap: 24px;
  padding: 24px;
  box-sizing: border-box;
}

/* 左侧 大屏 6 */
.left {
  flex: 6 1 0%;
  min-width: 320px;
  background: #1f8ef1;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 82px;
  border-radius: 8px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

/* 右侧 大屏 4 */
.right {
  flex: 4 1 0%;
  min-width: 320px;
  background: #f8f9fb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 8px;
  box-sizing: border-box;
}

/* 卡片与表单基础样式 */
.login-card {
  width: 100%;
  max-width: 720px;
  /* 桌面上限制最大宽度 */
  padding: 64px;
  box-sizing: border-box;
}

.card-title {
  margin: 0 0 18px;
  font-size: 18px;
  text-align: center;
}

.form {
  margin-top: 8px;
}

.submitBtn {
  width: 100%;
}

.backBtn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  border: 1px solid #ccc;
  background: #fff;
  transition: all 0.2s ease;
}

.backBtn:hover {
  background: #f5f5f5;
  border-color: #aaa;
}

/* 保持图片和品牌基础样式 */
.brand-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.boxbg {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 420px;
}

/* 响应式：当宽度较小时，左右列纵向排列 */
/* 🌙 移动端登录页面样式 */
@media (max-width: 767px) {
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f2f4f7;
    /* 柔和灰背景 */
    padding: 0 5%;
    box-sizing: border-box;
  }

  .container {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 0;
    gap: 0;
  }

  /* 左侧部分转为顶部品牌区 */
  .left {
    flex: none;
    width: 100%;
    background: transparent;
    color: #333;
    text-align: center;
    padding: 40px 10px 20px;
    border-radius: 0;
  }

  .brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .brand-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #222;
  }

  .hero,
  .boxbg {
    display: none !important;
    /* ✅ 移动端不显示大图，节省空间 */
  }

  /* 登录卡片 */
  .right {
    flex: none;
    width: 100%;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 12px;
    padding: 28px 22px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-top: 10px;
  }

  .backBtn {
  height: 42px;
  font-size: 0.95rem;
  border-radius: 8px;
  margin-top: -6px; /* ✅ 与登录按钮之间稍微靠近一点 */
}

  .card-title {
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }

  /* 表单整体 */
  .form {
    margin-top: 10px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .el-input {
    font-size: 1rem;
  }

  /* 登录按钮 */
  .submitBtn {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
  }

  /* Logo 图片比例 */
  .brand .el-image {
    width: 56px !important;
    height: 56px !important;
  }
}
</style>