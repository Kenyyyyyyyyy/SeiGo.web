<template>
  <div class="login">
    <div class="container">
      <!-- 左侧：展示图文/品牌 -->
      <div class="left">
        <div class="brand">
          <el-image style="width: 64px; height: 64px" :src="logoUrl" fit="fit" />
          <h1 class="brand-title">SeiGou    AdminLoginPage</h1>
        </div>

        <div class="hero">
          <el-image class="boxbg" :src="boxBgUrl" fit="cover" />
          
        </div>
      </div>

      <!-- 右侧：登录表单，垂直水平居中 -->
      <div class="right">
        <el-card class="login-card" shadow="always">
          <h2 class="card-title">系统登录</h2>

          <el-form
            :model="form"
            label-width="120px"
            label-position="top"
            size="large"
            class="form"
            :rules="rules"
            ref="ruleFormRef"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                @keyup.enter="onSubmit(ruleFormRef)"
              />
            </el-form-item>

            <el-form-item>
              <el-button class="submitBtn" type="primary" @click="onSubmit(ruleFormRef)">
                登录
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
import store from '../store/index' 
import { useRouter } from 'vue-router'

const router = useRouter()
// --- 表单实例 ---
const ruleFormRef = ref<FormInstance>()

// --- 表单数据 ---
const form = reactive({
  userName: '',
  password: '',
})

// --- 表单验证规则 ---
const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// --- 图片路径占位符 ---
// 你需要把这些替换成你自己的图片资源路径，例如从 @/assets/ 导入
const logoUrl = ref('https://element-plus.org/images/element-plus-logo.svg')
const boxBgUrl = ref('/public/bg.jpg')


// --- 提交方法 ---
const onSubmit = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  
  await ruleFormRef.validate(async (valid, fields) => {
    if (valid) {
      ElMessage.success('表单验证通过，准备提交登录...')
      store().EditUserId(1)
      router.push('/AdminPage')
      // 在这里执行你的登录逻辑...
    } 
    else 
    {
      let errors :string = ""
      fields?.userName?.forEach((msg) => {
        errors += msg.message + ';'
      });
      fields?.password?.forEach((msg) => {
        errors += msg.message + ';'
      });
      ElMessage.error('表单验证失败: ' + errors)

    }
  })
}
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh; /* 覆盖原来的 100% 更可靠 */
  width: 100%;
  display: flex;
  align-items: stretch;
}

.container {
  flex: 1;
  width: 100%;
  text-align: center;
  display: flex;
  flex-wrap: nowrap; /* 大屏并排，窄屏改为换行 */
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
  max-width: 720px; /* 桌面上限制最大宽度 */
  padding: 64px;
  box-sizing: border-box;
}
.card-title { margin: 0 0 18px; font-size: 18px; text-align: center; }
.form { margin-top: 8px; }
.submitBtn { width: 100%; }

/* 保持图片和品牌基础样式 */
.brand-title { font-size: 22px; font-weight: 700; margin: 0; }
.boxbg { width: 100%; height: auto; object-fit: cover; max-height: 420px; }

/* 响应式：当宽度较小时，左右列纵向排列 */
@media (max-width: 1024px) {
  .container {
    flex-wrap: wrap;
    padding: 20px;
  }
  .left, .right {
    flex: 1 1 100%;
    min-width: 0;
    border-radius: 8px;
  }
  .left {
    padding: 48px 28px;
  }
  .right {
    padding: 28px 20px;
  }
  .login-card {
    max-width: 640px;
    padding: 48px;
  }
  .boxbg { max-height: 320px; }
}

/* 小屏优化：减少内边距、隐藏装饰图或缩小文字 */
@media (max-width: 600px) {
  .container { gap: 12px; padding: 12px; }
  .left { padding: 24px 16px; }
  .right { padding: 16px 12px; }
  .login-card { padding: 20px; max-width: 420px; }
  .brand-title { font-size: 18px; }
  .card-title { font-size: 16px; }
  .boxbg { display: none; } /* 可选：在非常小的屏幕隐藏左侧大图，节省空间 */
}

/* 极小屏幕再微调 */
@media (max-width: 420px) {
  .brand-title { font-size: 16px; }
  .login-card { padding: 16px; }
  .submitBtn { font-size: 14px; }
}
</style>