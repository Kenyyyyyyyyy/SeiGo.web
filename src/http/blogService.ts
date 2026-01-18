import axiosInstance from '../http/index'; // 复用我们唯一的实例


interface BackendBlogImage {
  imageUrl: string
  sortOrder: number
  publicId: string
}

interface BackendBlog {
  id: number;
  title: string;
  summary: string;
  displayDate: string;
  typeName: string;
  authorname: string;
  coverImageUrl: string;
  content: string;
  typeId: number | null;
  pinnedTime: string | null;
  images: BackendBlogImage[] 
}

interface BackendTypeInfo {
  id: number;
  typeName: string; 
}

interface CreateBlogForm {
  title: string;
  content: string;
  summary: string;
  typeId: number | null;
  displayDate: string | Date; 
  isPinned: boolean;
  coverImageUrl: string;
}

/**
 * 获取最新的博客新闻 (带分页)
 * @param page 页码 (例如 1)
 * @param size 每页数量 (例如 10)
 */
export const getLatestNews = async (page: number, size: number) => {
  try {
    const response = await axiosInstance.get('/api/BlogNews/GetBlogByPage', {
      params: {
        page,
        size
      }
    });

    // 检查业务逻辑是否成功
    if (response.data && response.data.resultCode === 200) {
      // 返回博客文章数组 (resultData)
      return response.data.resultData as BackendBlog[];
    } else {
      // 处理后端返回的业务错误
      console.error("获取新闻失败:", response.data.message);
      return []; // 返回空数组
    }

  } catch (error) {
    console.error("API 调用失败:", error);
    return []; // 返回空数组
  }
};


export const getAllTypes = async () => {
  try {
    // 你的 TypeController 路由可能是 [Route("api/Type")]
    // (确保你的 C# TypeController 有一个叫 GetAllTypes 的 [HttpGet] 方法)
    const response = await axiosInstance.get('/api/Type/GetTypes');
    if (response.data && response.data.resultCode === 200) {
      return response.data.resultData as BackendTypeInfo[];
    }
    return [];
  } catch (error) {
    console.error("获取类型失败:", error);
    return [];
  }
};


export const getPinnedBlogs = async () => {
  try {
    const response = await axiosInstance.get('/api/BlogNews/GetPinnedBlogs');
    if (response.data && response.data.resultCode === 200) {
      // (DTO 中已包含 CoverImageUrl, Title, Summary)
      return response.data.resultData as BackendBlog[]; 
    }
    return [];
  } catch (error) {
    console.error("获取置顶新闻失败:", error);
    return [];
  }
};


export const createBlog = async (formData: CreateBlogForm) => {
  try {

    const response = await axiosInstance.post(
      '/api/BlogNews/CreateBlog', 
      formData // <-- 直接发送 JS 对象
    );
    

    if (response.data && response.data.resultCode === 200) {
      return true; // 成功
    } else {
      console.error("创建博客失败:", response.data.message);
      return false; // 业务逻辑失败
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return false; // 网络失败
  }
};

export const getPaginatedBlogs = async (page: number, size: number) => {
  try {
    const response = await axiosInstance.get('/api/BlogNews/GetBlogByPage', {
      params: {
        page,
        size
      }
    });

    // 检查业务逻辑是否成功
    if (response.data && response.data.resultCode === 200) {
      // (!!!) 返回完整的响应数据 (包含 resultData 和 count) (!!!)
      return response.data; 
    } else {
      console.error("获取分页新闻失败:", response.data.message);
      return { resultData: [], count: 0 }; // 返回空结构
    }

  } catch (error) {
    console.error("API 调用失败:", error);
    return { resultData: [], count: 0 }; // 返回空结构
  }
};

export const getBlogById = async (id: number) => {
  try {
    // (!!!) 使用正确的 API 路径 (!!!)
    const response = await axiosInstance.get(`/api/BlogNews/GetBlogDetail/${id}`);
    if (response.data && response.data.resultCode === 200) {
      return response.data.resultData as BackendBlog;
    } else {
      console.error("获取博客失败:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return null;
  }
};

export const updateBlog = async (formData: CreateBlogForm) => {
  try {
    // (!!!) 使用正确的 API 路径 (!!!)
    const response = await axiosInstance.put(`/api/BlogNews/EditBlog`, formData);
    if (response.data && response.data.resultCode === 200) {
      return true;
    } else {
      console.error("更新博客失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return false;
  }
};

export const deleteBlog = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/api/BlogNews/DeleteBlog?id=${id}`);

    if (response.data && response.data.resultCode === 200) {
      return true;
    } else {
      console.error("删除博客失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return false;
  }
};

export const deleteImageApi = (publicId: string) => {
  return axiosInstance.delete(`/api/FileUpload/DeleteImage`, { params: { publicId } });
};