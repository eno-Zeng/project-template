/**
 * 用户详情
 */
export interface UserDetail {
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

/**
 * 获取用户详情请求参数
 */
export interface GetUserDetailParams {
  /**
   * 用户ID
   */
  id: string;
}

/**
 * 更新用户请求参数
 */
export type UpdateUserParams = UserDetail;
