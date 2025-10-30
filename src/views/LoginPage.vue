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
  height: 100%;
  width: 100%;
}

.container {
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex; 
}

/* 左侧 6 */
.left {
  flex: 6;
  background: #1f8ef1; /* 左侧背景色，可按需修改 */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 82px;
  border-radius: 8px;
}

.brand{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

/* 右侧 4 */
.right {
  flex: 4;
  background: #f8f9fb; /* 右侧背景色，可按需修改 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 8px;
}

/* 卡片与表单基础样式 */
.login-card {
  width: 100%;
  max-width: 900px;
  padding: 90px;
  box-sizing: border-box;
}
.card-title { margin: 0 0 18px; font-size: 18px; text-align: center; }
.form { margin-top: 8px; }
.submitBtn { width: 100%; }

/* 保持图片和品牌基础样式 */
.brand-title { font-size: 22px; font-weight: 700; margin: 0; }
.boxbg { width: 100%; height: auto;  object-fit: cover; }
</style>
// ...existing code...