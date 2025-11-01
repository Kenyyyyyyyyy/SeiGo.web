<template>
  <div class="manage-blogs-container">
    <div class="header">
      <el-button @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1>管理文章</h1>
    </div>

    <el-card class="table-card">
      <el-table :data="blogs" v-loading="loading" style="width: 100%">
        
        <el-table-column type="expand">
          <template #default="props">
            <div class="summary-content">
              <strong>摘要：</strong>
              <p>{{ props.row.summary }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" width="180">
          <template #default="scope">
            {{ formatNewsDate(scope.row.displayDate) }}
          </template>
        </el-table-column>

        <el-table-column prop="typeName" label="类型" width="120" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="authorname" label="作者" width="150" />
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row.id)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="pagination.total"
        v-model:current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { getPaginatedBlogs, deleteBlog } from '../http/blogService';

// 2. 匹配 BlogModelDTO 的接口
interface Blog {
  id: number;
  title: string;
  summary: string;
  displayDate: string;
  typeName: string;
  authorname: string;
  // ... (其他字段)
}

const router = useRouter();
const loading = ref(true);
const blogs = ref<Blog[]>([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 3. 格式化日期 (从 HomePage.vue 复制)
const formatNewsDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// 4. 获取数据函数
const fetchData = async () => {
  loading.value = true;
  try {
    // 调用新的 API 函数
    const response = await getPaginatedBlogs(pagination.currentPage, pagination.pageSize);
    if (response) {
      blogs.value = response.resultData;
      pagination.total = response.count;
    }
  } catch (error) {
    ElMessage.error('加载文章列表失败。');
  } finally {
    loading.value = false;
  }
};

// 5. 分页器事件
const handlePageChange = (newPage: number) => {
  pagination.currentPage = newPage;
  fetchData();
};

// 6. 页面加载时获取数据
onMounted(() => {
  fetchData();
});

// 7. (占位符) 操作方法
const handleEdit = (id: number) => {
  // (!!!) 跳转到编辑页面 (!!!)
  router.push(`/AdminPage/edit/${id}`);
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要永久删除这篇文章吗？',
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    const success = await deleteBlog(id);
    if (success) {
      ElMessage.success(`已成功删除 ID: ${id}`);
      fetchData(); // 刷新数据
    } else {
      ElMessage.error(`删除 ID: ${id} 失败`);
    }
  } catch (error) {
    // (捕获 ElMessageBox 的 "cancel" 动作)
    ElMessage.info('已取消删除');
  }
};
</script>

<style scoped>
.manage-blogs-container {
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
.table-card {
  border-radius: 8px;
}
.summary-content {
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
.summary-content p {
  margin: 5px 0 0 0;
  line-height: 1.6;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>