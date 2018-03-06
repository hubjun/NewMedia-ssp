/**
 * Created by zhu on 2017/12/25.
 * api env
 */
import axios from 'axios'
import qs from 'qs';
import {bus} from '../bus.js'

let base = 'http://192.168.2.212:83';  //测试环境
// let base = 'http://xmt.g3user.com';   //生产环境
// export const imageUrl = 'http://xmt.g3user.com';  //生产图片资源
export const imageUrl = 'http://192.168.2.212:83'; //测试图片资源
export const uploadFile = base + '/starMedia/file/add';
axios.defaults.withCredentials = false;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//添加一个请求拦截器
// axios.interceptors.request.use(function (config) {
//   console.dir(config);
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data && response.data.errcode) {
    if (parseInt(response.data.errcode) === 1000) {
      //未登录
      bus.$emit('goto', '/login');
    }
  }
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, qs.stringify(params)).then(res => res.data)
}

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {params: params}).then(res => res.data)
}

export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(`${base}${url}`, {params: params}).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data)
}
