import {request} from '.'

export function login(data: Record<string, any>) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}


export function register(data: Record<string, any>) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}