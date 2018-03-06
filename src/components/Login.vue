<template>
  <div id="container">
    <div id="nav">
      <nav>
        <div class="logo">
          <img src="../assets/images/logo.png" alt="">
          <span class="line"></span><span class="brand">星媒体平台</span>
        </div>
        <ul>
          <li><a >首页</a></li>
          <li><a>产品优势</a></li>
          <!--<li><a >新手教程</a></li>-->
          <li><a >合作伙伴</a></li>
          <li><a >联系我们</a></li>
        </ul>
        <div class="navRight">
          <div class="login"><i class="fa fa-unlock-alt" aria-hidden="true" ></i>登录</div>
          <div class="reg"><router-link to="/regis"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>注册</router-link></div>
        </div>
      </nav>
    </div>

    <div id="wrap">
      <div id="main" style="top: 0;">
        <div id="page1" class="content">
          <div class="bannre_divp">
            <p class="banner_pone ">自媒体联盟</p>
            <p class="banner_two">变现产品创新，共创优质内容生态</p>
          </div>
          <el-form ref="accountFrom" :model="account" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
            <h3 class="title">用户登录</h3>
            <el-form-item prop="username">
              <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input type="password" v-model="account.pwd" @keydown.enter.native="handleLogin" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
            <!--<span class="regis"><router-link to="/regis">注册新用户</router-link></span>-->
            <div class="btnBox">
              <span class="regBtn" @click="registerUser">免费注册</span>
            </div>
            <el-form-item style="width:100%;">
              <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">立即登录</el-button>
            </el-form-item>
          </el-form>
          <img src="../assets/images/arrow.png" alt="" >
        </div>

        <div id="page2" class="content">
          <div class="page2">
            <h3>产品优势</h3>
            <p>G3云推广星媒体服务是为自媒体，提供专业、易用、高效的广告管理与变现服务的平台，通过对资源的精细化管理和对售卖模式的智能优化，为媒体实现最大化变现收益。</p>
            <ul>
              <li>
                <img src="../assets/images/list1.png" alt="">
                <dl>
                  <dt>10w+广告主</dt>
                  <dd>大数据精准推荐广告</dd>
                </dl>
              </li>
              <li>
                <img src="../assets/images/list2.png" alt="">
                <dl>
                  <dt>为自媒体提供专业</dt>
                  <dd>易用和高效的媒体投放服务</dd>
                </dl>
              </li>
              <li>
                <img src="../assets/images/list3.png" alt="">
                <dl>
                  <dt>自媒体自主入驻</dt>
                  <dd>审核通过即可实现创收</dd>
                </dl>
              </li>
              <li>
                <img src="../assets/images/list4.png" alt="">
                <dl>
                  <dt>粉丝经济</dt>
                  <dd>自媒体创业者增加流量变现好渠道</dd>
                </dl>
              </li>
            </ul>
          </div>
          <img src="../assets/images/arrow.png" alt="">
        </div>

        <div id="page4" class="content">
          <a class="page4"></a>
          <div class="page4">
            <h3>合作伙伴</h3>
            <img src="../assets/images/spirte.png" alt="">
          </div>
          <img src="../assets/images/arrow.png" alt="">
        </div>

        <div id="page5" class="content">
          <div class="page5">
            <h3>联系方式</h3>
            <ul>
              <li>
                <img src="../assets/images/icon1.png" alt="">
                <dl>
                  <dt>QQ</dt>
                  <dd>1073903097</dd>
                </dl>
              </li>
              <li>
                <img src="../assets/images/icon2.png" alt="">
                <dl>
                  <dt>合作邮箱</dt>
                  <dd>zhuweiya@51g3.net</dd>
                </dl>
              </li>
              <li>
                <img src="../assets/images/icon3.png" alt="">
                <dl>
                  <dt>合作电话</dt>
                  <dd>0755-61613862</dd>
                </dl>
              </li>
              <li>
                <img src="../assets/images/icon4.png" alt="">
                <dl>
                  <dt><img src="../assets/images/saoma.png" ></dt>
                  <dt>服务微信公众号</dt>
                </dl>
              </li>
            </ul>
          </div>
          <footer>
            <p>Copyright © 2008-2018 深圳市南方网通网络技术开发有限公司 All Rights Reserved 备案号:粤ICP备09019646号-4</p>
            <p>地址：深圳市南山区关口二路智恒产业园16栋三楼    增值电信业务经营许可证粤B2-20100216</p>
          </footer>
          <div class="up"><img src="../assets/images/dingbu_top.png" alt=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from '../api/apis';
  import md5 from 'js-md5';
  import $ from 'jquery';
  //import ElCol from "element-ui/packages/col/src/col";
  export default {
    //components: {ElCol},
    data() {
      return {
        loading: false,
        account: {
          username: '',
          pwd: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
        startTime : 0, //开始翻屏时间
        endTime : 0,
        now : 0,
        i:1
      }
    },
    methods: {
      handleLogin() {
        let that = this;
        this.$refs.accountFrom.validate((valid) => {
          if (valid) {
            this.loading = true;
            var code = 'NFWTSYS';
            var key = md5("password="+ this.account.pwd + '&username=' + this.account.username +'&key='+ code);
            let loginParams = {username: this.account.username, password: this.account.pwd, key: key};
            API.login(loginParams).then(function (rs) {
              that.loading = false;
              if (rs.code === 0) {
                sessionStorage.setItem('access-user', JSON.stringify(rs.data));
                //let user = JSON.parse(sessionStorage.getItem('access-user'));
                //that.$store.commit('SET_ROUTERS', user.permissions)
                //that.$router.addRoutes(that.$store.getters.addRouters);
                //that.$router.options.routes = that.$store.getters.routers;
                that.$router.push({path: '/task/list'});
              } else {
                that.$message({type: 'warning', showClose: true, message: rs.message || '登录失败', duration: 2500});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
      registerUser() {
        this.$router.push({ path: '/regis' });
      },
      addListener(){
        if ((navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)){
          //for firefox;
          document.addEventListener("DOMMouseScroll",this.scrollFun,false);
        }
        else if (document.addEventListener) {
          document.addEventListener("mousewheel",this.scrollFun,false);
        }
        else if (document.attachEvent) {
          document.attachEvent("onmousewheel",this.scrollFun);
        }
        else{
          document.onmousewheel = this.scrollFun;
        }
      },

      removeListener(){
        if ((navigator.userAgent.toLowerCase().indexOf("firefox")!=-1)){
          document.removeEventListener("DOMMouseScroll",this.scrollFun,false);
        }else if (document.removeEventListener) {
          document.removeEventListener("mousewheel",this.scrollFun,false);
        }else if (document.attachEvent) {
          document.attachEvent("onmousewheel",this.scrollFun);
        }else{
          document.onmousewheel = this.scrollFun;
        }
      },

      scrollFun(event){
        var orderHeight = document.documentElement.clientHeight;
        this.startTime = new Date().getTime();
        var delta = event.detail || (-event.wheelDelta);

        if ((this.endTime - this.startTime) < -1000) {
          //1秒内执行一次翻页
          if (delta > 0 && parseInt(document.getElementById('main').style.top) > -orderHeight * ( $('.content').length - 1)) { //向下翻页
            this.i = parseInt((parseInt(main.style.top)*(-1))/orderHeight)+1;
            this.now = this.i*orderHeight;
            $("#main").animate({top:(-this.now+'px')},500);
          }
          if (delta < 0 && parseInt(main.style.top) < 0) { //向上翻页
            this.i = parseInt((parseInt(main.style.top)*(-1))/orderHeight)-1;
            this.now = this.i*orderHeight;
            $("#main").animate({top:(-this.now+'px')},500);
          }
          this.endTime = new Date().getTime();
        }
        else{
          event.preventDefault();
        }
      },

      init(){
        var orderHeight = document.documentElement.clientHeight;var i = 1;
        document.getElementById('main').style.height = orderHeight+'px';
        document.getElementById("app").style.position = 'static';
        $('.content').height(orderHeight);

        this.addListener(orderHeight,i);
        $('.up').click(function(){
          $("#main").animate({top:'0px'},500);
        });
        $('.login').click(function(){
          $("#main").animate({top:'0px'},500);
        });
        $('nav ul li').click(function(){
          $("#main").animate({top:($(this).index()*orderHeight*(-1)+'px')},500);
        });
        $('.content>img').click(function(){
          this.i = parseInt((parseInt(main.style.top)*(-1))/orderHeight)+1;
          this.now = this.i*orderHeight;
          //console.log(this.i,this.now);
          $("#main").animate({top:(-this.now+'px')},500);
        });
        $('.tutorial ul li').mouseover(function(){
          $(this).addClass("active").siblings().removeClass("active")
        })
      }
    },
    mounted() {
      this.init();
    },
    beforeRouteLeave(to, from, next){
      this.removeListener();
      next()
    }
  }
</script>
<style>
  body {
    /*background: #DFE9FB;*/
  }
</style>
<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #ace, #00C1DE); /* IE 10 */
    background: -moz-linear-gradient(top, #ace, #00C1DE); /*火狐*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE)); /*谷歌*/
    background: -webkit-linear-gradient(top, #ace, #00C1DE); /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top,#ace, #00C1DE); /*Opera 11.10+*/
    /*.title {*/
      /*margin: 0px auto 40px auto;*/
      /*text-align: center;*/
      /*color: #505458;*/
    /*}*/
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .regis{
      width:100%;
      display: inline-block;
      font-size: 13px;
      margin-bottom: 10px;
      cursor: pointer;
      text-align: right;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .content>img {position: absolute; bottom:30px; left:50%; -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);-webkit-animation:start 1.5s infinite ease-in-out;animation:start 1.5s infinite ease-in-out;cursor: pointer;padding:30px 30px 0 30px;}
  @keyframes start{
    0% {bottom:30px; }
    50% {opacity: 1;}
    100% {bottom:0px; opacity: 0;}
  }
  @-webkit-keyframes start {
    0% {bottom:30px; }
    50% {opacity: 1;}
    100% {bottom:0px; opacity: 0;}
  }
  ul{margin:0;padding:0}
  ul li{list-style:none;margin:0;padding:0}
  body{width:100%;height:100%}
  #container{width:100%;height:100%;overflow:hidden}
  #container #nav{position:fixed;top:0;left:0;width:100%;height:50px;background:#373d41;color:#fff;font-size:14px;z-index:1999}
  nav{width:1200px;height:50px;overflow:hidden;margin:0 auto;line-height:50px;margin:0 auto}
  nav .logo{width:300px;float:left;display:inline-block;line-height:50px;vertical-align:middle}
  .logo img{height:32px;vertical-align:middle}
  .logo .line{display:inline-block;width:1px;height:18px;line-height:50px;margin:-6px 13px;background:#fff}
  .logo .brand{position: absolute; top: 3px}
  .logo span{font-size:16px}
  nav ul{height:50px;line-height:53px;text-align:center;float:left;list-style:none;float:left;padding:0;margin:0;margin-left:70px}
  nav ul li{display:inline-block}
  nav ul li a{color:#fff;text-decoration:none;display:block;padding:0 25px; cursor: pointer;}
  nav ul li a:hover{background:rgba(0,0,0,.2)}
  nav .navRight{height:50px;line-height:50px;float:right}
  .login{display:inline-block;color:#b5cdf2;padding-left:8px; cursor: pointer;}
  .reg{display:inline-block;color:#b5cdf2;padding-left:8px}
  .reg a{color:#b5cdf2;text-decoration:none}
  .reg a:hover{color:#fff}
  .login:hover{color:#fff}
  .navRight i{padding:0 8px;color:#fff}
  #wrap{overflow:hidden;width:100%}
  #main{top:0;position:relative}
  .content{width:100%;margin:0;height:100%}
  #page1{background:url(../assets/images/index.jpg) no-repeat center 50px;background-size:cover;position:relative;overflow:hidden}
  #page1 form{position:absolute;top:50%;left:50%;margin:0;transform:translateY(-50%);margin-left:10%;width:360px;box-sizing:border-box;padding:0 46px;background:rgba(0,0,0,.5);border:none}
  form .title{font-size:24px;font-weight:700;line-height:92px;color:#fff;margin:0;text-align:center}
  form .el-button{background:#07d3ff}
  .btnBox{ margin: 0 0 10px; text-align: right}
  .regBtn{color:#07d3ff;font-size: 14px;cursor:pointer;text-align: right}
  .regBtn:hover{text-decoration:underline}
  #page2{position:relative;overflow:hidden}
  #page2 .page2{width:1200px;height:490px;position:absolute;top:50%;left:50%;overflow:hidden;text-align:center;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}
  .page2 h3{font-size:40px;color:#333;padding-bottom:28px;margin:0;font-weight:400}
  .page2>p{width:830px;font-size:18px;color:#666;line-height:30px;margin:0 auto}
  .page2 ul{width:100%;height:280px;padding-top:70px}
  .page2 ul li{width:25%;height:100%;float:left;text-align:center}
  .page2 ul li dl{margin:0;text-align:center;font-size:14px;color:#666;line-height:24px;padding-top:15px}
  .page2 ul li dl dd{margin:0}
  #page3{position:relative;overflow:hidden}
  #page3 .page3{width:1200px;height:490px;position:absolute;text-align:center;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}
  .page3 h3{font-size:40px;color:#333;padding-bottom:68px;margin:0;font-weight:400}
  .page3 .tutorial{width:100%;height:410px}
  .tutorial ul{width:310px;height:100%;padding-left:64px;float:left}
  .tutorial ul li{width:100%;height:30px;line-height:30px;margin:20px 0;position:relative;font-size:18px;color:#333;text-align:left;cursor:pointer}
  .tutorial ul li span{display:inline-block;margin-right:20px;width:26px;height:26px;text-align:center;line-height:26px}
  .tutorial ul li.active span{background:#000;color:#fff;border-radius:50%}
/*  .tutorial ul li.active:nth-child(1):after{content:'';width:137px;height:71px;position:absolute;top:16px;left:286px;background:url(../assets/images/line1.png) no-repeat center; z-index: 9999;}
  .tutorial ul li.active:nth-child(2):after{content:'';width:143px;height:75px;position:absolute;top:-30px;left:260px;background:url(../assets/images/line2.png) no-repeat center; z-index: 9999;}
  .tutorial ul li.active:nth-child(3):after{content:'';width:143px;height:64px;position:absolute;top:13px;left:186px;background:url(../assets/images/line3.png) no-repeat center; z-index: 9999;}
  .tutorial ul li.active:nth-child(4):after{content:'';width:208px;height:54px;position:absolute;top:6px;left:124px;background:url(../assets/images/line4.png) no-repeat center; z-index: 9999;}
  .tutorial ul li.active:nth-child(5):after{content:'';width:173px;height:66px;position:absolute;top:-25px;left:155px;background:url(../assets/images/line5.png) no-repeat center; z-index: 9999;}*/

  /*.tutorial .tutorImg{width:720px;height:100%;float:left;background:url(../assets/images/list6.png) no-repeat left center;position:relative;overflow:hidden;}*/
  .tutorImg .img {position: absolute; width:603px; height:340px; overflow: hidden;  top: 33px; left: 52px; }
  #page4{position:relative;overflow:hidden}
  #page4 .page4{width:1200px;height:580px;position:absolute;text-align:center;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}
  .page4 h3{font-size:40px;color:#333;padding-bottom:50px;margin:0;font-weight:400}
  #page5{position:relative;overflow:hidden}
  #page5 .page5{width:1200px;height:434px;position:absolute;text-align:center;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}
  .page5 h3{font-size:40px;color:#333;padding-bottom:126px;margin:0;font-weight:400}
  .page5 ul{width:1200px;height:268px;display:flex}
  .page5 ul li{height:210px;border-right:#dbe7ef solid 1px;text-align:center}
  .page5 ul li:last-child{border-right:none}
  .page5 ul li:nth-child(1){width:258px}
  .page5 ul li:nth-child(2){width:342px}
  .page5 ul li:nth-child(3){width:308px}
  .page5 ul li:nth-child(4){width:290px}
  .page5 ul li dl{font-size:18px;margin-top:15px;line-height:28px}
  .page5 ul li dd{margin:0;color:#1899dc}
  .page5 ul li dt{color:#333}
  footer{width:100%;height:78px;background:#f2f5f8;color:#aaa;font-size:14px;position:absolute;bottom:0;text-align:center;box-sizing:border-box;padding:17px 0}
  footer p{line-height:22px;margin:0}
  .bannre_divp{width: 490px;  position:absolute; top:50%; right:50%; margin-right:9%;}
  .banner_pone{font-size:48px; color:#ffffff; height:70px; line-height:60px;margin:0;}
  .banner_two{font-size:30px; color:#ffffff; height:70px; line-height:40px;margin:0;}
  .up {
    position: absolute;
    bottom: 30%;
    right: 50%;
    margin-right: -660px;
    cursor: pointer;
  }
</style>
