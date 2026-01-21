<template>
  <div class="message-manage-container">
    <div class="header">
      <el-button @click="router.back()">返回</el-button>
      <h2>留言反馈管理</h2>
    </div>

    <el-table 
      :data="tableData" 
      v-loading="loading" 
      style="width: 100%" 
      border 
      stripe
    >
      <el-table-column 
        prop="createTime" 
        label="送信時間" 
        width="180" 
        :formatter="formatDate" 
      />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="content" label="留言内容" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP地址" width="150" />
      
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="fetchMessages"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
// 1. 引入刚才创建的 service
import { getMessages, deleteMessage } from '../http/messageService' 

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10

const formatDate = (row: any) => {
  return dayjs(row.createTime).format('YYYY-MM-DD HH:mm')
}

// 2. 使用 service 改写获取数据方法
const fetchMessages = async () => {
  loading.value = true
  try {
    const data = await getMessages(currentPage.value, pageSize)
    
    if (data.resultCode === 200) {
      tableData.value = data.resultData
      total.value = data.count
    } else {
      ElMessage.error(data.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('权限不足或登录已过期')
  } finally {
    loading.value = false
  }
}

// 3. 使用 service 改写删除方法
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除来自 "${row.name}" 的留言吗？`,
    '警告',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    try {
      const data = await deleteMessage(row.id)
      if (data.resultCode === 200) {
        ElMessage.success('删除成功')
        if (tableData.value.length === 1 && currentPage.value > 1) {
          currentPage.value--
        }
        fetchMessages()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.message-manage-container {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  min-height: 400px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end; /* 分页器靠右显示 */
}

/* 调整表格内内容的垂直居中 */
:deep(.el-table .cell) {
  white-space: pre-line; /* 支持留言内容换行显示 */
}
</style>