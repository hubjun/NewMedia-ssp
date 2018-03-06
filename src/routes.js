import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
// import Dashboard from '@/components/Dashboard'
import TopMedia from '@/components/topMedia'
import TaskList from '@/components/toptask/list'
import Finance from '@/components/finance'
import FollowUp from '@/components/toptask/followUp'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'
import regis from '@/components/register'

//懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/regis',
      name: '注册',
      component: regis
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home,
    //   redirect: '/dashboard',
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'iconfont icon-home',
    //   children: [
    //     {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
    //   ]
    // },
    {
      path: '/',
      component: Home,
      name: '任务',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users',
      children: [
        {path: '/task/list', component: TaskList, name: '头条任务', menuShow: true,
          // children: [{path: '/task/follow/:taskId/:ttId/:status', component: FollowUp, name: 'follow', menuShow: true}]
        },
        {path: '/task/follow/:taskId/:ttId/:status', component: FollowUp, name: 'follow', menuShow: true}
        //{path: '/task/followUp', component: FollowUp, name: '任务跟进列表', menuShow: true},
        // {path: '/task/records', component: TaskRecords, name: '提交跟进记录', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '头条号管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users',
      children: [
        {path: '/topMedia', component: TopMedia, name: '头条账号', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '资产',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users',
      children: [
        {path: '/finance', component: Finance, name: '我的资产', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('access-user'))
    if (!user && to.path != '/login') {
      next({path: '/login'})
    }if (to.path == '/regis'){
      next()
    } else {
      next()
    }
  }
})
export default router
