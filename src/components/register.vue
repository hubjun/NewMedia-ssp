<template>
  <div id="container">
      <div id="nav">
          <nav>
            <div class="logo">
              <img src="../assets/images/logo.png" alt="">
              <span class="line"></span>
              <span class="brand">新用户注册</span>
            </div>
            <ul>
              <li><router-link to="/login">首页</router-link></li>
              <li><router-link to="/login#page2">产品优势</router-link></li>
              <li><router-link to="/login#page3">新手教程</router-link></li>
              <li><router-link to="/login#page4">合作伙伴</router-link></li>
              <li><router-link to="/login#page5">联系我们</router-link></li>
            </ul>
            <div class="navRight">
              <div class="login"><router-link to="/login"><i class="fa fa-unlock-alt" aria-hidden="true"></i>登录</router-link></div>
              <!-- <div class="reg"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>注册</div> -->
            </div>
          </nav>
      </div>

      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="100px" class="demo-ruleForm login-container">
            <el-form-item prop="username" label="用户名：">
                <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手 机：">
                <el-input type="text" v-model="ruleForm2.mobile" auto-complete="off" placeholder="您的手机号码"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="验证码" style="width: 400px;">
                <el-input placeholder="请输入短信验证码" v-model="ruleForm2.code" >
                  <!--<template slot="append">.com</template>-->
                  <!--<span id="require"  slot="append" @click="queryCode">点击获取</span>-->
                  <el-button class="queryCode" v-text="sendMsg" @click="queryCode" :disabled="sendMsgBtn" type="text" slot="append"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="设置密码:">
                <el-input type="password" v-model="ruleForm2.password" placeholder="密码" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="rePassword" label="确认密码:">
                <el-input type="password" v-model="ruleForm2.rePassword" placeholder="确认密码" auto-complete="off"></el-input>
            </el-form-item>
            <div class="panel"><span class="returnBack"><router-link to="/login">返回登录</router-link></span></div>
            <!--<el-form-item label="年龄" prop="age">-->
                <!--<el-input v-model.number="ruleForm2.age"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click.native.prevent="submitForm('ruleForm2')" :loading="logining">注 册</el-button>
                <!--<el-button @click="resetForm('ruleForm2')">重置</el-button>-->
            </el-form-item>
        </el-form>
  </div>
</template>

<script>
    import API from '../api/apis';
    import md5 from 'js-md5';
    export default {
      data() {
        var validatePhone = (rule, value, callback) => {
          if(!value){
            return callback(new Error('手机号码不能是空'));
          }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){
            return callback(new Error('手机号码有误'));
            //return false;
          }else {
            callback();
          }
        };
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          }else{
            if (this.ruleForm2.rePassword !== '') {
              this.$refs.ruleForm2.validateField('rePassword');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          //console.log(value);
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if(typeof(value) == 'undefined' || value === ''){
            callback(new Error('请再次输入密码'));
          } else if (typeof(value) != 'undefined' && value !== '' && value !== this.ruleForm2.password) {
            callback(new Error('两次输入密码不一致！'));
          } else {
            callback();
          }
        };
        return {
          logining: false,
          sendMsg: '免费获取验证码',
          sendMsgBtn: false,
          ruleForm2: {
            username: '',
            mobile: '',
            password: '',
            rePassword: '',
            code: '',
            //age: ''
          },
          rules2: {
            username: [
              { required: true, message: '请输入用户名称', trigger: 'blur'}
            ],
            mobile: [{required: true, validator: validatePhone, trigger: 'blur'}],
            password: [
              {required: true, validator: validatePass, trigger: 'blur' }
            ],
            rePassword: [
              {required: true, validator: validatePass2, trigger: 'change' }
            ],
            code: [{ required: true, message: '请输入您的手机验证码', trigger: 'blur'}]
          }
        };
      },
      methods: {
        submitForm(formName) {
          let that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.logining = true;
              var code = 'NFWTSYS';
              var key = md5('mobile='+this.ruleForm2.mobile +"&password="+ this.ruleForm2.password +"&rePassword=" + this.ruleForm2.rePassword + '&username=' + this.ruleForm2.username +'&key='+ code);
              let params = {
                username: this.ruleForm2.username,
                mobile: this.ruleForm2.mobile,
                password: this.ruleForm2.password,
                rePassword: this.ruleForm2.rePassword,
                code: this.ruleForm2.code,
                key: key
              };
              //console.log(params);
              API.register(params).then((rs) => {
                //console.log(rs);
                if(rs.code == '0'){
                  that.$confirm('恭喜您，注册成功！请等待审核...是否返回登录？','提示',{type: 'success'}).then(() => {
                    that.$router.push({path: '/login'});
                  }).catch(() => {
                    that.logining = false;
                    that.$refs[formName].resetFields();
                  });
                }else{
                  that.logining = false;
                  that.$message({
                    type: 'warning',
                    message: rs.message + '！'
                  });
                }
              }, function(err){
                that.logining = false;
                that.$message({showClose: true, message: err.toString(), duration: 2000});
              }).catch(() => {
                that.logining = false;
                that.$message.error({showClose: true, message: '请求出现异常，请稍后在试！',duration: 2000});
                //that.$message({type: 'warning',message: rs.msg + '！'});
              });
            } else {
              //console.log('validate error!');
              return false;
            }
          });
        },
        queryCode(){
          let that = this;
          if(that.ruleForm2.mobile == ''){
            that.$message({type: 'info', message: '请填写您的手机号码！', duration: 3000});
          }else{
            let params = {
              mobile: this.ruleForm2.mobile,
              type: 1,
            };
            console.log(params)
            let timeCount = 60;
            let interval = setInterval(function(){
              if(timeCount <= 0 ){
                clearInterval(interval);
                that.sendMsg = '重新发送验证码';
                that.sendMsgBtn = false;
                return
              }else{
                that.$nextTick(() =>{
                  that.sendMsgBtn = true;
                  that.sendMsg = timeCount + '秒后可重发';
                })
                //console.log(this.sendMsg)
                timeCount--;
              }
            }, 1000)
            API.getCode(params).then((rs) => {
              console.log(rs);
              if(rs.code === 0){
                //that.$message.success('验证码发送成功！');
                //code
              }else {
                that.$message({message: rs.message, type:'warning'});
                //that.digLoading = false;
              }
            }).catch((err) => {
              //that.loading = false;
              that.$message({type: 'error', message: err.toString() || '请求出现异常', duration: 3000});
            });
          }
        }
//        resetForm(formName) {
//          this.$refs[formName].resetFields();
//        }
      },
      mounted(){
        //this.mesg = '免费获取验证码';
      }
    }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 500px;
    padding: 35px 35px 15px 35px;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .queryCode{
      padding: 0 15px;
    }
    .panel{
        margin-bottom: 20px;
      text-align: right;
      box-sizing: border-box;
      padding-right: 20px;
    }
    .panel a {
      color:#20a0ff
    }
    .panel .returnBack{
        color: #1f2d3d;
        font-size: 14px;
        cursor: pointer;
    }
    .returnBack:hover{
        text-decoration: underline;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
<style scoped>

  .el-form .el-form-item{}
  .el-input{}
   ul {
        margin: 0;
        padding: 0;
    }
    ul li {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    body {
        width: 100%;
        height: 100%;
    }
    #container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    #container #nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: #373d41;
        color: #fff;
        font-size: 14px;
        z-index: 1999;
    }
  nav {
        width: 1200px;
        height: 50px;
        overflow: hidden;
        margin: 0 auto;
        line-height: 50px;
        margin: 0 auto;
    }
    nav .logo {
        width: 300px;
        float: left;
        display: inline-block;
        line-height: 50px;
        vertical-align: middle;
    }
    .logo img{height:32px;vertical-align:middle}
    .logo .line {
        display: inline-block;
        width: 1px;
        height: 20px;
        line-height: 50px;
        margin: -6px 13px;
        background: #fff;
    }
    .logo .brand{position: absolute; top: 3px;}
    .logo span {font-size:16px;}
    nav ul {
        height: 50px;
        line-height: 50px;
        text-align: center;
        float: left;
        list-style: none;
        float: left;
        padding: 0;
        margin: 0;
        margin-left: 70px;
    }
    nav ul li {
        display:inline-block;
    }
    nav ul li a{color:#fff; text-decoration: none;display:block;padding: 0 25px;}
    nav ul li a:hover {
        background: rgba(0,0,0,.2);
    }
    nav .navRight {
        height: 50px;
        line-height: 50px;
        float: right;
    }
    .login {
        display: inline-block;
        color: #b5cdf2;
        padding-left: 8px;
    }
    .reg{
        display: inline-block;
        color: #b5cdf2;
        padding-left: 8px;
    }
     .login a{
          color: #b5cdf2;
          text-decoration: none;
      }
      .login a:hover{
          color: #fff;
      }
    .navRight i {
        padding: 0 8px;
        color: #fff;
    }
</style>
