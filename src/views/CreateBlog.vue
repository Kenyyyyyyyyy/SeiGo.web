<template>
  <div class="create-blog-container">
    <div class="header">
      <el-button @click="router.push('/AdminPage')" type="text" size="large">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回
      </el-button>
      <h1>创建新文章</h1>
    </div>

    <el-card class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="100px" v-loading="loading">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>

            <el-form-item label="文章摘要 (用于卡片显示)" prop="summary">
              <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入摘要" />
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <div style="border: 1px solid #ccc">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                />
                <Editor
                  style="height: 500px; overflow-y: hidden;"
                  v-model="form.content" 
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="handleCreated"
                />
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="发布日期 (用于排序和显示)" prop="displayDate">
              <el-date-picker v-model="form.displayDate" type="datetime" placeholder="选择日期和时间" style="width: 100%" />
            </el-form-item>

            <el-form-item label="文章类型" prop="typeId">
              <el-select v-model="form.typeId" placeholder="请选择类型" style="width: 100%">
                <el-option v-for="type in typesList" :key="type.id" :label="type.typeName" :value="type.id" />
              </el-select>
            </el-form-item>

            <el-form-item label="封面照片" prop="coverImageUrl">
              <el-upload class="cover-uploader" :auto-upload="false" :show-file-list="false"
                :on-change="handleCoverChange" :before-upload="beforeImageUpload">
                <img v-if="form.coverImageUrl" :src="form.coverImageUrl" class="cover" />
                <el-icon v-else class="uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>

            <!-- <el-form-item label="正文图片（可多选）">
              <el-upload v-model:file-list="fileList" multiple list-type="picture-card" :auto-upload="false"
                :on-change="handleImagesChange" :on-remove="handleImageRemove">
                <el-icon>
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item> -->


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
import '@wangeditor/editor/dist/css/style.css' 
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ref, reactive, onMounted ,onBeforeUnmount, shallowRef} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { getAllTypes, createBlog, getBlogById, updateBlog, deleteImageApi } from '../http/blogService';
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus';
import { Plus, ArrowLeft } from '@element-plus/icons-vue';
import axiosInstance from '../http/index';


// --- 状态和实例 ---
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const formRef = ref<FormInstance>();
const loading = ref(false);
const blogId = ref<number | null>(null);
const multiUploadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/FileUpload/UploadImages`
const fileList = ref<any[]>([]);
const coverFile = ref<File | null>(null);
const imagesToDelete = ref<string[]>([]);
const editorRef = shallowRef()
const toolbarConfig = {}


// --- 表单数据 ---
const form = reactive({
  title: '',
  content: '',
  summary: '',
  typeId: null as number | null,
  displayDate: '',
  isPinned: false,
  coverImageUrl: '',
  images: [] as { url: string; sortOrder: number }[]
})


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
      originalContentIds.value = extractPublicIdsFromHtml(response.content);
      form.images = (response.images || []).map(img => ({
        url: img.imageUrl,
        publicId: img.publicId, // 必须传这个，handleImageRemove 才能拿到
        name: 'image.jpg',
        sortOrder: img.sortOrder
      }));

      fileList.value = (response.images || []).map(img => ({
        url: img.imageUrl, // 注意后端返回的是 imageUrl 还是 url，需保持一致
        name: img.imageUrl.substring(img.imageUrl.lastIndexOf('/') + 1),
        publicId: img.publicId
      }));
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

const uploadUrl =
  `${import.meta.env.VITE_API_BASE_URL || 'https://seigou-webapi.onrender.com'}/api/FileUpload/UploadImage`;
console.log('[Upload URL]', uploadUrl);

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请检查表单，确保所有必填项已填写');
      return;
    }

    loading.value = true;
    try {
      // --- 第一阶段：上传封面图片 (按日期重命名) ---
      if (coverFile.value) {
        const coverFormData = new FormData();
        const newCoverName = getFormattedFileName(coverFile.value);
        coverFormData.append('file', coverFile.value, newCoverName);

        const coverRes = await axiosInstance.post('/api/FileUpload/UploadImage', coverFormData);
        if (coverRes.data.resultCode === 200) {
          form.coverImageUrl = coverRes.data.resultData.url;
        } else {
          throw new Error('封面图片上传失败');
        }
      }

      // --- 第二阶段：上传正文相册多图 (El-Upload 选中的图) ---
      const newImagesToUpload = fileList.value.filter(f => f.raw);
      let uploadedGalleryMetadata: any[] = [];

      if (newImagesToUpload.length > 0) {
        const multiFormData = new FormData();
        newImagesToUpload.forEach(f => {
          const rawFile = f.raw as File;
          const newName = getFormattedFileName(rawFile);
          multiFormData.append('files', rawFile, newName);
        });

        const multiRes = await axiosInstance.post('/api/FileUpload/UploadImages', multiFormData);
        if (multiRes.data.resultCode === 200) {
          uploadedGalleryMetadata = multiRes.data.resultData; 
        } else {
          throw new Error('相册图片上传失败');
        }
      }

      // --- 第三阶段：关键修改！整合“相册图”与“文中图” ---

      // 1. 获取相册中保留的旧图
      const existingGalleryImages = fileList.value
        .filter(f => !f.raw)
        .map((f, index) => ({
          Url: f.url,
          PublicId: (f as any).publicId,
          SortOrder: index,
          ImageType: 'gallery' // 标记为相册图
        }));

      // 2. 转换相册中刚上传的新图
      const newGalleryImages = uploadedGalleryMetadata.map((img, index) => ({
        Url: img.url,
        PublicId: img.publicId,
        SortOrder: existingGalleryImages.length + index,
        ImageType: 'gallery'
      }));

      // 3. 【核心新增】从富文本 HTML 中提取文中图并整合
      const contentHtml = form.content;
      const contentPublicIds = extractPublicIdsFromHtml(contentHtml);
      
      // 将提取出的文中图 PublicId 转换为后端接收的格式
      const contentImages = contentPublicIds.map((pid, index) => ({
        // 动态构建 Cloudinary URL (假设你的云名称已配置在环境变量)
        Url: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/upload/${pid}`,
        PublicId: pid,
        SortOrder: index,
        ImageType: 'content' // 标记为文中图，防止其出现在前台相册轮播中
      }));

      // 4. 合并所有资源：相册旧图 + 相册新图 + 文中图
      const allImages = [...existingGalleryImages, ...newGalleryImages, ...contentImages];

      // --- 第四阶段：构建最终 Payload 并提交 ---
      // 计算富文本中被手动删除的图片，用于后续云端物理删除
      const currentContentIds = contentPublicIds;
      const deletedContentIds = originalContentIds.value.filter(id => !currentContentIds.includes(id));

      const finalPayload = {
        Title: form.title,
        Summary: form.summary,
        Content: form.content, 
        TypeId: form.typeId,
        DisplayDate: new Date(form.displayDate).toISOString(),
        IsPinned: form.isPinned,
        CoverImageUrl: form.coverImageUrl,
        Images: allImages // 包含所有类型的图片关联
      };

      let isSuccess = false;
      if (blogId.value) {
        isSuccess = await updateBlog({ ...finalPayload, id: blogId.value } as any);
      } else {
        isSuccess = await createBlog(finalPayload as any);
      }

      // --- 第五阶段：资源双删清理 ---
      if (isSuccess) {
        const allPendingDelete = [...new Set([...imagesToDelete.value, ...deletedContentIds])];
        
        if (allPendingDelete.length > 0) {
          console.log('正在执行云端资源清理...', allPendingDelete);
          const deleteTasks = allPendingDelete.map(pid => deleteImageApi(pid));
          await Promise.allSettled(deleteTasks);
          imagesToDelete.value = [];
        }

        ElMessage.success('文章保存成功！');
        router.push('/AdminPage/manage');
      } else {
        ElMessage.error('保存失败，请检查服务器状态');
      }

    } catch (error: any) {
      console.error('提交失败:', error);
      ElMessage.error(error.message || '系统发生错误');
    } finally {
      loading.value = false;
    }
  });
};

// --- (其他函数保持不变) ---
const resetForm = () => {
  formRef.value?.resetFields();
};


const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('图片必须是 JPG/PNG 格式!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大小不能超过 4MB!');
    return false;
  }
  return true;
};

// --- 封面图片选择回调 ---
const handleCoverChange: UploadProps['onChange'] = (uploadFile) => {
  if (!uploadFile.raw) return;

  // 校验格式和大小（复用之前的逻辑）
  if (!beforeImageUpload(uploadFile.raw)) return;

  // 1. 暂存文件对象，用于提交
  coverFile.value = uploadFile.raw;

  // 2. 创建本地预览地址 (blob:http://...)
  form.coverImageUrl = URL.createObjectURL(uploadFile.raw);
};

// --- 正文图片选择回调 ---
const handleImagesChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  // 过滤掉不符合条件的（如果需要），这里 element 会自动更新 fileList
  console.log('当前暂存的正文图片数量:', uploadFiles.length);
};

// --- 移除图片回调 ---
// 修改后的函数
const handleImageRemove: UploadProps['onRemove'] = (uploadFile) => {
  // 使用类型断言 (uploadFile as any) 来访问自定义属性
  const pid = (uploadFile as any).publicId;

  // 判断逻辑：
  // 1. 必须有 pid
  // 2. 且没有 raw 属性（说明不是本次新选的，而是已存在的旧图）
  if (pid && !uploadFile.raw) {
    imagesToDelete.value.push(pid);
    console.log('记录待删除的旧图:', pid);
  }
};

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 1. 设置前端拦截限制
      maxFileSize: 4 * 1024 * 1024, // 4MB

      //2. 自定义上传逻辑
      async customUpload(file: File, insertFn: any) {
        // 校验文件大小 (双重保险)
        if (file.size > 4 * 1024 * 1024) {
          ElMessage.error('图片大小不能超过 4MB');
          return;
        }

        const formData = new FormData();
        const newFileName = getFormattedFileName(file);

        // 【核心修改】使用 append 的第三个参数来重命名文件
        // 后端接收到的 file.FileName 将会是这个新名称
        formData.append('file', file, newFileName);

        try {
          // 使用您项目中已有的 axiosInstance
          const res = await axiosInstance.post('/api/FileUpload/UploadImage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              // 确保携带 Token，因为后端 FileUploadController 带有 [Authorize] 特性
              'Authorization': `Bearer ${authStore.token}`
            }
          });

          // 3. 对接您的 ApiResult 业务逻辑
          if (res.data && res.data.resultCode === 200) {
            const { url } = res.data.resultData;
            // 参数依次为：图片地址、alt 文本、点击链接
            insertFn(url, newFileName, url);
          } else {
            ElMessage.error(res.data.message || '图片上传失败');
          }
        } catch (error: any) {
          console.error('文中图片上传出错:', error);
          ElMessage.error('网络错误或服务器无响应');
        }
      }
    }
  }
};

// 组件销毁时，必须销毁编辑器实例
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 模板中 @onCreated 绑定的回调函数
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录编辑器实例，以便后续操作
}

// 从 HTML 字符串中提取 Cloudinary 的 PublicId (假设路径包含 seigou_uploads)
const extractPublicIdsFromHtml = (htmlContent: string): string[] => {
  if (!htmlContent) return [];
  // 匹配形如 seigou_uploads/xxxx 的字符串，直到遇到引号、空格或点号
  const regex = /seigou_uploads\/[^.\s"']+/g;
  const matches = htmlContent.match(regex);
  return matches ? [...new Set(matches)] : [];
};

// 用于存储编辑模式下初始的内容图片 ID 列表，以便对比删除
const originalContentIds = ref<string[]>([]);

const getFormattedFileName = (file: File): string => {
  const now = new Date();
  // 生成日期部分: 20260117_144309
  const datePart = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') + '_' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  // 生成4位随机字符串，防止同秒上传冲突
  const randomPart = Math.random().toString(36).substring(2, 6);

  // 获取原文件后缀名 (例如 .png 或 .jpg)
  const extension = file.name.substring(file.name.lastIndexOf('.'));

  // 最终格式: 20260117_144309_a7b2.png
  return `${datePart}_${randomPart}${extension}`;
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

@media (max-width: 767px) {

  /* 整体容器 */
  .create-blog-container {
    padding: 16px;
    margin: 0 auto;
    max-width: 100%;
  }

  /* 顶部标题与返回按钮 */
  .header {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    margin-bottom: 16px;
  }

  .header h1 {
    font-size: 1.4rem;
    margin: 0;
  }

  .header .el-button {
    font-size: 0.9rem;
    padding: 0;
    color: var(--el-color-primary);
  }

  /* 卡片样式优化 */
  .form-card {
    padding: 16px 12px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  /* 表单整体 */
  .el-form {
    width: 100%;
  }

  /* 两栏合并为一栏 */
  .el-row {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .el-col {
    width: 100% !important;
    max-width: 100% !important;
    flex: none !important;
  }

  /* 表单项 */
  .el-form-item {
    margin-bottom: 16px;
  }

  /* 输入框与文字大小调整 */
  .el-input__inner,
  .el-textarea__inner {
    font-size: 1rem;
  }

  /* 上传组件 */
  .cover-uploader .el-upload {
    width: 100%;
    border-radius: 8px;
  }

  .uploader-icon {
    width: 100%;
    height: 150px;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cover {
    width: 100%;
    border-radius: 8px;
  }

  /* 日期、选择器等输入组件宽度适配 */
  .el-date-editor,
  .el-select {
    width: 100% !important;
  }

  /* 表单按钮区域 */
  .form-actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    margin-top: 20px;
  }

  .form-actions .el-button {
    width: 100%;
    height: 44px;
    font-size: 1rem;
    margin-bottom: 10px;
  }

  /* 立即创建按钮主色调 */
  .form-actions .el-button--primary {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}
</style>