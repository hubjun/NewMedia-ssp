/**
 * Created by zhu on 2017/12/25.
 * api request list
 */
import * as API from './'
export default {
  baseImage: API.imageUrl,
  uploadFile: API.uploadFile,
  login: params => {
    return API.POST('/starMedia/user/login', params)
  },
  logout: params => {
    return API.GET('/starMedia/user/logout', params)
  },
  register: params => {
    return API.POST('/starMedia/user/register', params)
  },
  getCode: params => {
    return API.GET('/starMedia/public/send', params)
  },
  getUserInfo: params => {
    return API.POST('/starMedia/user/getUserinfo', params)
  },
  changeProfile: params => {
    return API.POST('/starMedia/user/modifyUserinfo', params)
  },
  changePwd: params => {
    return API.POST('/starMedia/user/modifyPass', params)
  },
  retrievePwd: params => {
    return API.POST('/starMedia/user/forgetPass', params)
  },
  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },
  topAccount: params => {
    return API.POST('/starMedia/toutiao/list', params)
  },
  createTopAccount: params => {
    return API.POST('/starMedia/toutiao/add', params)
  },
  editTopAccount: params => {
    return API.POST('/starMedia/toutiao/edit', params)
  },
  topAccDetails: params => {
    return API.POST('/starMedia/toutiao/details', params)
  },
  getProvince: () => {
    return API.POST('/starMedia/public/province')
  },
  getCity: param => {
    return API.POST('/starMedia/public/city', param)
  },
  getTopCategory: () => {
    return API.POST('/starMedia/public/category')
  },
  topAccDelete: params => {
    return API.POST('/starMedia/toutiao/delete', params)
  },
  topTaskList: params => {
    return API.POST('/starMedia/toutiaoTask/list', params)
  },
  taskDetail: params => {
    return API.POST('/starMedia/toutiaoTask/details', params)
  },
  taskDeals: params => {
    return API.POST('/starMedia/toutiaoTask/handle', params)
  },
  taskRecordAdd: params => {
    return API.POST('/starMedia/toutiaoTaskFollow/add', params)
  },
  taskCppyEdit: params => {
    return API.POST('/starMedia/Toutiaotaskcontent/add', params)
  },
  taskCppyQuery: params => {
    return API.POST('/starMedia/Toutiaotaskcontent/get', params)
  },
  taskFollowList: params => {
    return API.POST('/starMedia/toutiaotaskfollow/list', params)
  },
  bankCardList: params => {
    return API.POST('/starMedia/bank/list', params)
  },
  bankCardEdit: params => {
    return API.POST('/starMedia/bank/edit', params)
  },
  bankCardAdd: params => {
    return API.POST('/starMedia/bank/add', params)
  },
  userWithdraw: params => {
    return API.POST('/starMedia/Finance/withdraw', params)
  },
  financeInfo: params => {
    return API.POST('/starMedia/account/details', params)
  },
  financeList: params => {
    return API.POST('/starMedia/finance/index', params)
  },
  financeDelete: params => {
    return API.POST('/starMedia/bank/delete', params)
  },
  financeWithdrawLs: params => {
    return API.POST('/starMedia/finance/withdrawList', params)
  }
}
