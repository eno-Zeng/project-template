/**
 * 获取用户列表请求参数
 */
export interface GetUserListParams {
  /**
   * 用户名
   */
  name?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 页码
   */
  page: number;
  /**
   * 每页数量
   */
  pageSize: number;
}

/**
 * 用户列表项
 * */
export interface UserListItem {
  /**
   * 用户ID
   */
  id: string;
  /**
   * 用户名
   */
  name: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 邮箱
   */
  email: string;
}
