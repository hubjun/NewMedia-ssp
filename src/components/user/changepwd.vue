<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="10" class="warp-main">
      <el-form ref="editForm" :model="form" :rules="editRules" label-width="120px">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="rePass">
          <el-input v-model="form.rePass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click.native="changepwd">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/apis'
  import util from '../../common/util'
  export default{
    data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入您的新密码'));
        }else{
          if (this.form.rePass !== '') {
            this.$refs.editForm.validateField('rePass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入您的新密码'));
        } else if(typeof(value) == 'undefined' || value === ''){
          callback(new Error('请再次输入您的新密码'));
        } else if (typeof(value) != 'undefined' && value !== '' && value !== this.form.newPwd) {
          callback(new Error('确认密码与新密码不一致！'));
        } else {
          callback();
        }
      };
      return {
        form: {
          oldPwd: '',
          newPwd: '',
          rePass: ''
        },
        editRules: {
          oldPwd: [
            { required: true, message: '请输入您的原密码', trigger: 'blur'}
          ],
          //mobile: [{required: true, validator: validatePhone, trigger: 'blur'}],
          newPwd: [
            {required: true, validator: validatePass, trigger: 'blur' }
          ],
          rePass: [
            {required: true, validator: validatePass2, trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      changepwd() {
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          token: users.token,
          user_id: users.user_id,
          oldPassword: that.form.oldPwd,
          password: that.form.newPwd,
          rePassword: that.form.rePass
        };
        that.$refs.editForm.validate((valid) => {
          if(valid){
            API.changePwd(params).then((rs) => {
              console.log(rs);
              if(rs.code === 0){
                that.$message({type: 'success', message: '密码修改成功！', duration: 3000});
                that.$refs['editForm'].resetFields();
              }else {
                that.$message({message: rs.message, type: 'error'});
              }
            }).catch((err) => {
              that.$message.error({showClose: true, message: '请求出现异常' || err.toString(), duration: 3000});
            });
          }else{
            return false;
          }
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .warp-main{
    margin: 36px 0 10px;
  }
</style>
