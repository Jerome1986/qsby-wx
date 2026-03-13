import type {
  ProjectCate,
  ProjectItem,
  ProjectListPageResponse,
  ProjectSubmitResponse,
  SubmitProjectFormData,
} from '@/types/Project'
import { request } from '@/utils/http'

/**
 * 获取项目分类
 */
export const projectAllCateGetApi = () => {
  return request<ProjectCate>({
    method: 'GET',
    url: '/project/getAllCate',
  })
}

/**
 * 获取项目列表
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const projectListFindAllApi = (pageNum: number, pageSize: number) => {
  return request<ProjectListPageResponse>({
    method: 'GET',
    url: '/project/findAll',
    data: { pageNum, pageSize },
  })
}

/**
 * 获取项目详情
 * @param projectId - 项目ID
 */
export const projectDetailGetApi = (projectId: string) => {
  return request<ProjectItem>({
    method: 'GET',
    url: '/project/detail',
    data: { projectId },
  })
}

/**
 * 发布项目
 * @param data - 提交参数
 */
export const projectSendApi = (data: SubmitProjectFormData) => {
  return request<ProjectSubmitResponse>({
    method: 'POST',
    url: '/project/add',
    data,
  })
}
