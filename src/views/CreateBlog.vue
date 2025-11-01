<template>
  <div class="create-blog-container">
    <div class="header">
      <el-button @click="router.back()" type="text" size="large">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1>创建新文章</h1>
    </div>

    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="100px"
        v-loading="loading"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>

            <el-form-item label="文章摘要 (用于卡片显示)" prop="summary">
              <el-input
                v-model="form.summary"
                type="textarea"
                :rows="3"
                placeholder="请输入摘要"
              />
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <el-input
                v-model="form.content"
                type="textarea"
                :rows="15"
                placeholder="请输入内容... (推荐升级为富文本编辑器)"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="发布日期 (用于排序和显示)" prop="displayDate">
              <el-date-picker
                v-model="form.displayDate"
                type="datetime"
                placeholder="选择日期和时间"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="文章类型" prop="typeId">
              <el-select v-model="form.typeId" placeholder="请选择类型" style="width: 100%">
                <el-option
                  v-for="type in typesList"
                  :key="type.id"
                  :label="type.typeName"
                  :value="type.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="封面照片" prop="coverImageUrl">
              <el-upload
                class="cover-uploader"
                action="/api/FileUpload/UploadImage"
                :headers="{ Authorization: `Bearer ${authStore.token}` }"
                :show-file-list="false"
                :on-success="handleCoverSuccess"
                :before-upload="beforeImageUpload"
              >
                <img v-if="form.coverImageUrl" :src="form.coverImageUrl" class="cover" />
                <el-icon v-else class="uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="置顶">
              <el-switch v-model="form.isPinned" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <el-form-item class="form-actions">
          <el-button type="primary" size="large" @click="onSubmit" :loading="loading">
            立即创建
          </el-button>
          <el-button size="large" @click="resetForm">
            重置
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted  } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
// (!!!) 1. 确保导入了所有需要的函数 (!!!)
import { getAllTypes, createBlog, getBlogById, updateBlog } from '../http/blogService';
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus';
import { Plus, ArrowLeft } from '@element-plus/icons-vue';

// (!!!) 2. 修正 BackendBlog 接口 (!!!)

// --- 状态和实例 ---
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const formRef = ref<FormInstance>();
const loading = ref(false);
const blogId = ref<number | null>(null);

// (!!!) 3. 动态设置标题 (!!!)
//const pageTitle = computed(() => blogId.value ? '编辑文章' : '创建新文章');

// --- 表单数据 ---
const form = reactive({
  title: '',
  content: '',
  summary: '',
  typeId: null as number | null,
  displayDate: '',
  isPinned: false,
  coverImageUrl: ''
});

// --- 表单验证 --- (保持不变)
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  displayDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
  typeId: [{ required: true, message: '请选择类型', trigger: 'change' }],
  coverImageUrl: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
});

// --- 下拉菜单数据 --- (保持不变)
const typesList = ref<{ id: number; typeName: string }[]>([]);

// --- (!!!) 4. 修正 fetchBlogData (!!!)
const fetchBlogData = async (id: number) => {
  loading.value = true;
  try {
    const response = await getBlogById(id);
    if (response) {
      form.title = response.title;
      form.content = response.content;
      form.summary = response.summary;
      form.typeId = response.typeId;
      form.displayDate = response.displayDate;
      form.coverImageUrl = response.coverImageUrl;
      // (!!!) 关键：通过 PinnedTime 设置 isPinned (!!!)
      form.isPinned = response.pinnedTime !== null;
    } else {
      ElMessage.error('加载文章失败。');
    }
  } catch (error) {
    ElMessage.error('加载文章时发生错误。');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// --- 页面加载 --- (保持不变)
onMounted(async () => {
  typesList.value = await getAllTypes();
  if (route.params.id) {
    blogId.value = Number(route.params.id);
    await fetchBlogData(blogId.value);
  }
});

// --- (!!!) 5. 修正 onSubmit 逻辑 (!!!)
const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const payload = {
          ...form,
          displayDate: new Date(form.displayDate).toISOString(),
        };

        let success = false;
        if (blogId.value) {
          // (!!!) 6. 编辑文章：payload 必须包含 id (!!!)
          const editPayload = { ...payload, id: blogId.value };
          success = await updateBlog(editPayload); // (!!!) 只传一个参数 (!!!)
        } else {
          // (!!!) 7. 创建文章 (!!!)
          success = await createBlog(payload); // (!!!) 只传一个参数 (!!!)
        }

        if (success) {
          ElMessage.success('文章保存成功！');
          router.push('/AdminPage/manage'); // (!!!) 跳转到管理列表页
        } else {
          ElMessage.error('保存失败，请检查后端日志。');
        }
      } catch (error) {
        ElMessage.error('保存过程中发生错误。');
        console.error(error);
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.error('请检查表单，所有项目均为必填项。');
    }
  });
};

// --- (其他函数保持不变) ---
const resetForm = () => {
  formRef.value?.resetFields();
};

const handleCoverSuccess: UploadProps['onSuccess'] = (response, _uploadFile) => {
  if (response.resultCode === 200) {
    form.coverImageUrl = response.resultData;
    formRef.value?.validateField('coverImageUrl');
  } else {
    ElMessage.error(response.message || '封面上传失败');
  }
};

const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('图片必须是 JPG/PNG 格式!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  return true;
};
</script>

<style scoped>
.create-blog-container {
  padding: 40px;
  max-width: 1200px;
  margin: 20px auto;
}
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.form-card {
  border-radius: 8px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
}

/* --- 上传组件样式 --- */
.cover-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.cover-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.cover {
  width: 100%;
  height: auto;
  display: block;
}
</style>