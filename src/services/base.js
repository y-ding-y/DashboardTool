import apiUrls from '@/services/api'
import { request, METHOD } from '@/utils/request'

/**
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function reqParas(props) {
  return request(apiUrls.PARA, METHOD.POST, props).then((res) => {
    return res.data
  })
}

export async function reqDelete(urlKey, props) {
  return request(apiUrls[urlKey], METHOD.DELETE, props).then((res) => {
    return res.data
  })
}
export async function reqPatch(urlKey, props) {
  return request(apiUrls[urlKey], METHOD.PATCH, props).then((res) => {
    return res.data
  })
}
export async function reqPost(urlKey, props) {
  return request(apiUrls[urlKey], METHOD.POST, props).then((res) => {
    return res.data
  })
}
export async function reqPut(urlKey, props) {
  return request(apiUrls[urlKey], METHOD.PUT, props).then((res) => {
    return res.data
  })
}
export async function reqGet(urlKey, props = null) {
  return request(apiUrls[urlKey], METHOD.GET, props).then((res) => {
    return res.data
  })
}

export async function reqShow(urlKey, props) {
  return request(apiUrls[urlKey], METHOD.POST, props, {
    responseType: 'blob',
  }).then((res) => {
    return res
  })
}

export default {
  apiUrls,
  reqParas,
  reqDelete,
  reqPatch,
  reqPost,
  reqPut,
  reqGet,
  reqShow,
}
