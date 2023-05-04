import { LOGIN, LOGOUT, ROUTES } from '@/services/api'
import { request, METHOD, removeAuthorization } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @param save 是否保存登錄狀態
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(username, password, savelogin) {
  return request(LOGIN, METHOD.POST, {
    username,
    password,
    savelogin,
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  request(LOGOUT, METHOD.POST, {}).then((res) => {
    if (res.data.code === 0) {
      localStorage.clear()
      removeAuthorization()
    }
  })
}

export default {
  login,
  logout,
  getRoutesConfig,
}
