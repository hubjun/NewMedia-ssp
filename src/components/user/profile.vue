<template>
  <!--<el-row class="warp">-->
  <div class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="set_account">
      <h3>基本资料<i class="el-icon-edit-outline"></i></h3>
      <ul class="userinfo">
        <li><span>用户名：</span>{{userInfo.username}}
          <b @click="editShow">修改资料</b></li>
        <li><span>手机号码：</span>{{userInfo.mobile}}</li>
        <li><span>姓  名： </span>{{userInfo.name | fotmatArgs}}</li>
        <li><span>电子邮箱：</span>{{userInfo.email | fotmatArgs}}</li>
        <li><span>Q Q： </span>{{userInfo.qq | fotmatArgs}}</li>
        <li><span>注册时间：</span>{{userInfo.resStaDate}}</li>
      </ul>
    </el-col>

    <el-dialog title="修改个人资料" :visible.sync="editFormVisible"  width="40%">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
        <el-form-item label="姓 名" prop="name">
          <el-input type="text" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input type="text" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Q Q" prop="qq">
          <el-input type="text" v-model="editForm.qq"></el-input>
        </el-form-item>
        <!--<el-form-item label="手 机" prop="email">-->
        <!--<el-input v-model="editForm.phone"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editSubmit" :loading="digLoading">提交</el-button>
        <el-button @click.native="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  <!--</el-row>-->
  </div>
</template>

<script>
  import API from '../../api/apis'
  import util from '../../common/util'
  import {bus} from '../../bus.js'
  export default {
    data() {
      return {
        loading: false,
        userInfo: [],
        editFormVisible: false,
        digLoading: false,
        editForm: {
          name: '',
          email: '',
          qq: '',
          //phone: ''
        },
        rules: {
          name: [
            {type: 'string', message: '姓名 最多10个字符', trigger: 'blur'}
          ],
          email: [
            //{required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ],
          qq: [{type: 'string', min:0, max: 15, message: 'qq最多15个字符', trigger: 'change'}]
        },
      }
    },
    methods: {
      getInfo(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          token: users.token,
          user_id: users.user_id
        };
        API.getUserInfo(params).then((rs) => {
          console.log(rs);
          if(rs.code === 0){
            rs.data.create_time == '' ? resStaDate = '暂无' : rs.data.resStaDate = util.formatDate.format(rs.data.create_time, 'yyyy-MM-dd hh:mm');
            that.userInfo = rs.data;
          }else {
            that.$message({message: rs.message, type:'warning'});
          }
        }).catch((err) => {
          that.$message({type: 'error',message: '请求出现异常' || err.toString(), duration: 3000});
        })
      },
      editShow(){
        let that = this;
        that.editForm.name = this.userInfo.name;
        that.editForm.email = this.userInfo.email;
        that.editForm.qq = this.userInfo.qq;
        that.editFormVisible = true;
      },
      editSubmit(){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          token: user.token,
          user_id: user.user_id,
          name: that.editForm.name,
          email: that.editForm.email,
          qq: that.editForm.qq
        };
        that.$confirm('确定要修改当前用户信息吗？', '提示', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.digLoading = true;
          API.changeProfile(params).then((rs) => {
            console.log(rs);
            if(rs.code === 0){
              that.$message.success('提交成功！');
              that.$refs['editForm'].resetFields();
              that.editFormVisible = false;
              //sessionStorage.setItem('access-user', JSON.stringify(user));
              //bus.$emit('setNickName', that.editForm.nickname);
              that.getInfo();
            }else {
              that.$message({
                message: rs.message,
                type:'error'
              });
              that.editFormVisible = true;
              that.digLoading = false;
            }
          }).catch((err) => {
            //that.loading = false;
            that.$message({type: 'error', message: err.toString() || '请求出现异常', duration: 3000});
          });
        }).catch(() => {})
      }
    },
    mounted() {
      this.getInfo();
    },
    filters: {
      fotmatArgs: function (args) {
        if(!args) return '暂无';
        return args;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .set_account>h3 {
    font-size: 20px;
    font-weight: normal;
    margin: 0;
    padding: 12px 5px;
    border-bottom: 1px solid #ddd;
  }
  .userinfo {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    list-style: none;
    padding: 20px 0 20px 0;
    overflow: hidden;
  }
  .userinfo li {
    font-size: 16px;
    color: #333;
    line-height: 30px;
    margin-bottom: 15px;
    text-indent: 10px;
  }
  .userinfo li span {
    display: inline-block;
    width: 120px;
    color: #888888;
  }
  .userinfo li b {font-weight: normal; color:blue; cursor:pointer; margin:0 10px; color:#20a0ff; font-size:12px;}
  .userinfo li b:hover {color:red;}
</style>
