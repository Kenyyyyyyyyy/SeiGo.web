<template>
  <div class="manage-types-container">
    <div class="header">
      <el-button @click="router.push('/AdminPage')" type="text" size="large">
        <el-icon><ArrowLeft /></el-icon>
        返回管理界面
      </el-button>
      <h1>文章类型管理</h1>
    </div>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>类型列表</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon>
            新增类型
          </el-button>
        </div>
      </template>

      <el-table :data="typesList" v-loading="loading" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="typeName" label="类型名称" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="openDialog(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="400px"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="formRef" :rules="rules" label-position="top">
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus, ArrowLeft } from '@element-plus/icons-vue'; // 导入 ArrowLeft
import {
  getAllTypes,
  createType,
  editType,
  deleteType,
  type TypeInfo,
} from '../http/typeService';

// --- 实例 ---
const router = useRouter(); // 实例化 router

// --- 状态 ---
const loading = ref(false);
const submitLoading = ref(false);
const typesList = ref<TypeInfo[]>([]);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

// --- 表单数据 ---
const initialForm = {
  id: 0,
  typeName: '',
};
const form = reactive({ ...initialForm });

// --- 计算属性 ---
const isEditMode = computed(() => form.id !== 0);
const dialogTitle = computed(() => (isEditMode.value ? '编辑类型' : '新增类型'));

// --- 表单验证规则 ---
const rules = reactive<FormRules>({
  typeName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
});

// --- 方法 ---

/**
 * 加载类型列表
 */
const fetchTypes = async () => {
  loading.value = true;
  typesList.value = await getAllTypes();
  loading.value = false;
};

/**
 * 打开新增/编辑对话框
 * @param row 待编辑的行数据 (可选)
 */
const openDialog = (row?: TypeInfo) => {
  // 重置表单
  Object.assign(form, initialForm);
  formRef.value?.resetFields();

  if (row) {
    // 编辑模式
    form.id = row.id;
    form.typeName = row.typeName;
  }

  dialogVisible.value = true;
};

/**
 * 处理对话框关闭
 */
const handleClose = (done: () => void) => {
  formRef.value?.resetFields();
  done();
};

/**
 * 提交表单 (新增或编辑)
 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      let success = false;

      if (isEditMode.value) {
        // 编辑
        success = await editType(form.id, form.typeName);
      } else {
        // 新增
        success = await createType(form.typeName);
      }

      submitLoading.value = false;

      if (success) {
        ElMessage.success(isEditMode.value ? '类型编辑成功！' : '类型新增成功！');
        dialogVisible.value = false;
        await fetchTypes(); // 刷新列表
      } else {
        ElMessage.error('操作失败，请检查网络或后端日志。');
      }
    }
  });
};

/**
 * 处理删除操作
 * @param id 待删除的类型 ID
 */
const handleDelete = (id: number) => {
  ElMessageBox.confirm('此操作将永久删除该类型, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      loading.value = true;
      const success = await deleteType(id);
      loading.value = false;

      if (success) {
        ElMessage.success('删除成功!');
        await fetchTypes(); // 刷新列表
      } else {
        ElMessage.error('删除失败，请检查网络或后端日志。');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// --- 生命周期钩子 ---
onMounted(() => {
  fetchTypes();
});
</script>

<style scoped>
.manage-types-container {
  padding: 40px;
  max-width: 1200px;
  margin: 40px auto 20px  auto;
}
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.header h1 {
  margin: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .manage-types-container {
    padding: 16px;
    margin: 0 auto;
    max-width: 100%;
  }

  .header {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .header h1 {
    font-size: 1.4rem;
    margin: 0;
  }

  .el-card {
    border-radius: 10px;
  }

  .el-table {
    font-size: 0.9rem;
  }

  .el-button {
    font-size: 0.8rem;
  }
}
</style>