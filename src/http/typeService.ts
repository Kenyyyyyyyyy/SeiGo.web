import axiosInstance from '../http/index';

// 对应后端的 TypeInfo 模型
export interface TypeInfo {
  id: number;
  typeName: string;
}

// 对应后端的统一响应结构 (假设)
interface ApiResult {
  resultCode: number;
  message: string;
  resultData: any;
}

/**
 * 获取所有文章类型
 */
export const getAllTypes = async (): Promise<TypeInfo[]> => {
  try {
    const response = await axiosInstance.get<ApiResult>('/api/Type/GetTypes');

    if (response.data && response.data.resultCode === 200) {
      return response.data.resultData as TypeInfo[];
    } else {
      console.error("获取类型失败:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("API 调用失败 (GetTypes):", error);
    return [];
  }
};

/**
 * 创建新文章类型
 * @param typeName 类型名称
 */
export const createType = async (typeName: string): Promise<boolean> => {
  try {
    // 后端 Creat 接口接收 string typeName，使用 POST 请求
    const response = await axiosInstance.post<ApiResult>('/api/Type/Creat', null, {
      params: {
        typeName
      }
    });

    if (response.data && response.data.resultCode === 200) {
      return true;
    } else {
      console.error("创建类型失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("API 调用失败 (CreateType):", error);
    return false;
  }
};

/**
 * 编辑文章类型
 * @param id 类型 ID
 * @param typeName 新的类型名称
 */
export const editType = async (id: number, typeName: string): Promise<boolean> => {
  try {
    // 后端 Edit 接口接收 int id 和 string typeName，使用 PUT 请求
    const response = await axiosInstance.put<ApiResult>('/api/Type/Edit', null, {
      params: {
        id,
        typeName
      }
    });

    if (response.data && response.data.resultCode === 200) {
      return true;
    } else {
      console.error("编辑类型失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("API 调用失败 (EditType):", error);
    return false;
  }
};

/**
 * 删除文章类型
 * @param id 类型 ID
 */
export const deleteType = async (id: number): Promise<boolean> => {
  try {
    // 后端 Delete 接口接收 int id，使用 DELETE 请求
    const response = await axiosInstance.delete<ApiResult>('/api/Type/Delete', {
      params: {
        id
      }
    });

    if (response.data && response.data.resultCode === 200) {
      return true;
    } else {
      console.error("删除类型失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("API 调用失败 (DeleteType):", error);
    return false;
  }
};