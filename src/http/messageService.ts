import axiosInstance from '../http/index';

// 对应后端的 ApiResult 结构
interface ApiResult {
  resultCode: number;
  message: string;
  resultData: any;
  count: number;
}

/**
 * 分页获取留言列表
 */
export const getMessages = async (pageIndex: number, pageSize: number) => {
  try {
    const response = await axiosInstance.get<ApiResult>('/api/Message', {
      params: { pageIndex, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error("获取留言失败:", error);
    throw error;
  }
};

/**
 * 删除留言
 */
export const deleteMessage = async (id: number) => {
  try {
    const response = await axiosInstance.delete<ApiResult>(`/api/Message/${id}`);
    return response.data;
  } catch (error) {
    console.error("删除留言失败:", error);
    throw error;
  }
};