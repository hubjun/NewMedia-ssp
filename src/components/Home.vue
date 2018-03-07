<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="javascript:void(0)"><img src="../assets/logo.png"></a>
      </div>
      <div class="topbar-logos" v-show="!collapsed">
        <a href="javascript:void(0)" alt="南方网通">
          <span class="logotext">南方网通</span>
          <!--<img src="../assets/logotxt.png">-->
        </a>
      </div>
      <div class="topbar-title">
        <span style="font-size: 16px;color: #fff;">星媒体平台V1.0</span>
      </div>
      <div class="topbar-account topbar-btn">
        <!--<i class="el-icon-message"></i>-->
        <el-badge :value="totals" :max="99" @click="toMsg" class="item message-count">
          <i @click="toMsg" class="el-icon-message"></i>
        </el-badge>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <i class="iconfont icon-user"></i>
            欢迎，{{nickname}}  <i class="iconfont icon-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/user/profile"><span style="color: #555;font-size: 14px;">个人信息</span></router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link :to="'/user/changepwd'"><span style="color: #555;font-size: 14px;">修改密码</span></router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-menufold" v-show="!collapsed"></i>
          <i class="iconfont icon-menuunfold" v-show="collapsed"></i>
        </div>
        <!--导航菜单-->
        <el-menu default-active="0" router :collapse="collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''">
              <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
                            :class="$route.path==term.path?'is-active':''">
                <i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
                          :class="$route.path==item.children[0].path?'is-active':''">
              <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import {bus} from '../bus.js'
  import API from '../api/apis';
  export default {
    name: 'home',
    created(){
      //bus.$on('setNickName', (text) => {
       // this.nickname = text;
      //}),
      bus.$on('totalCounts', (value) => {
        this.totals = value;
      }),
      bus.$on('goto', (url) => {
        if (url === "/login") {
          sessionStorage.removeItem('access-user');
        }
        this.$router.push(url);
      })
    },
    data () {
      return {
        nickname: '',
        collapsed: false,
        totals: ''
      }
    },
    methods: {
      handleClose() {
        //console.log('handleclose');
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      showMenu(i, status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      },
      //进入消息
      toMsg: function() {
        //console.log(5555);
        let _this = this;
        _this.$router.push('/user/message');
      },

      messageCount(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params ={
          user_id: users.user_id,
          token: users.token
        };
        API.msgNolook(params).then((rs) => {
          //console.log(rs);
          if(rs.code === 0){
            that.totals = rs.data.total;
          }else{
            this.$message({message:rs.msg, type:'warning', duration: '4000'})
          }
        }).catch(() => {})
      },

      logout(){
        let that = this;
        this.$confirm('确认要退出系统吗?', '提示', {type: 'warning',
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          that.loading = true;
          API.logout().then(function (rs) {
            console.log(rs);
            that.loading = false;
            sessionStorage.removeItem('access-user');
            //that.$router.go('/login'); //用go刷新
            that.$router.push({path: '/login'});
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {});
      }
    },
    mounted() {
      let user = sessionStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        this.nickname = user.username || '';
      }
      this.messageCount();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #373d41;
      padding: 0px;
      .topbar-btn {
        color: #fff;
      }
      /*.topbar-btn:hover {*/
      /*background-color: #4A5064;*/
      /*}*/
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
        img{
          width: 40px;
          height: 40px;
        }
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
        .logotext{
          color: #fff;
          line-height: 50px;
        }
      }
      .topbar-logo img, .topbar-logos img {
        /*height: 40px;*/
        margin-top: 5px;
        margin-left: 13px;
      }
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 24px;
      }
      .message-count{
        line-height: normal;
        margin: 0 5px 3px 0;
        /*.el-badge__content{*/
        /*top: 20px !important;*/
        /*right: 21px !important;*/
        /*}*/
        i{
          font-size: 18px;
          padding-right: 3px;
          color: #fff;
          cursor: pointer;
        }
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }
    aside {
      min-width: 50px;
      background: #333744;
      &::-webkit-scrollbar {
        display: none;
      }
      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }
      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        background-color: #333744;
      }
      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }
      .el-menu .el-menu-item, .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }
      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #7ed2df;
      }
    }
    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }
    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      padding-bottom: 1px;
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
</style>
