<template>
  <div class="followUp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/task/list'}">头条任务</el-breadcrumb-item>
        <el-breadcrumb-item>任务跟进</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 10px">
      <el-button type="success" size="medium" @click="addRecord">新增跟进记录</el-button>
      <span class="btnlist" v-show="requestParams.status === 1">
        <el-button type="primary" plain size="medium" @click="acceptTask" :loading="acceptLoading">接受任务</el-button>
        <el-button type="primary" plain size="medium" @click="taskDialogVisible = true">拒绝任务</el-button>
      </span>
      <el-button class="back" plain size="medium" @click="returnBack">返回列表</el-button>
    </el-col>

    <div class="details">
      <div class="title"><span>任务标题：{{objDetails.name}}</span></div>
      <div class="breadcrumb">
        <span>总金额：</span>{{objDetails.price}}
        <span class="padlt15">类型：</span>{{objDetails.priceTypeStr}}
        <span class="padlt15">状态：</span>{{objDetails.statusStr}}
        <span class="padlt15">开始时间：</span>{{objDetails.resStaDate}}
        <span class="padlt15">结束时间：</span>{{objDetails.resEndDate}}
      </div>
      <div class="content">
        <p>头条内容：{{objDetails.content}}</p>
      </div>
      <div class="imgView">
        <!--objDetails.img_view-->
        <div class="item">
          <img class="recordImage" v-for="img in objDetails.img_view" :src="img" alt="">
          <!--<img class="recordImage" src="../../assets/images/sunrise.png" alt="">-->
        </div>
        <div class="detailsEdit">
          <el-button type="primary" plain size="medium" @click="editContentShow">修改文案</el-button>
        </div>
      </div>
      <div class="recordList">
        <h3><i class="el-icon-edit"></i>任务跟进记录</h3>
        <div class="content" v-for="obj in followTaskList">
          <span class="cont">{{obj.content}}</span>
          <p v-if="!obj.case_content == ''" class="copyContent">文案内容：{{obj.case_content.content}}</p>
          <div class="item">
            <div class="imgWarp">
              <img v-for="img in obj.copy_img" class="recordImage" :src="img" alt="">
              <!--<img class="recordImage" src="../../assets/images/sunrise.png" alt="">-->
            </div>
          </div>
          <div class="bottom">
            {{obj.username}} <span class="times">{{obj.create_time | formatDate}}</span>
            <el-button v-if="!obj.case_content == ''" size="medium" type="text" @click="editCopyShow(obj.task_id, obj.toutiao_id, obj.content_id)">修改文案</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="新增跟进记录" :visible.sync ="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="图片">
          <el-upload class="avatar-uploader" accept="image/*" ref="addRecordRef"
                     action="upload.action"
                     data="upload.data"
                     :show-file-list="false"
                     :action="upload.action"
                     :data="upload.data"
                     :on-change="addRecordUpOnChange"
                     :on-success="addUpIconOnSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imgPreview" :src="imgPreview" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addForm.content" :rows="8"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="addTaskSubmit" :loading="addLoading">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请填写拒绝原因" :visible.sync="taskDialogVisible" width="36%">
      <el-form ref="taskForm" :model="taskForm" :rules="taskRules">
        <!--<el-form-item label="处理类型：" prop="status" class="marB12">-->
          <!--<el-radio-group v-model="taskForm.status">-->
            <!--<el-radio :label="1" border>接受任务</el-radio>-->
            <!--<el-radio :label="2" border>拒绝任务</el-radio>-->
            <!--&lt;!&ndash;<el-radio :label="3" border>已处理</el-radio>&ndash;&gt;-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item class="marB0" label="备 注：" prop="remark">
          <el-input type="textarea" :rows="4" v-model="taskForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="taskDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="refuseTask()" :loading="dealLoading">提 交</el-button>
        </span>
    </el-dialog>

    <el-dialog title="修改文案内容" :visible.sync="copyDialogVisible" :before-close="closeDialog" width="40%">
      <el-form ref="copyFormRef" :model="copyForm" :rules="copyRules">
        <el-form-item label="内 容：" prop="content">
          <el-input type="textarea" v-model="copyForm.content" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item prop="file_ids">
          <label slot="label">
            上传图片
            <!--<el-tooltip placement="right">-->
              <!--<div slot="content">上传“文案图片”时<br/>图片支持jpg、jpeg、gif、png四种格式，图片大小不超过2M。</div>-->
              <!--<i class="el-icon-info"></i>-->
            <!--</el-tooltip>-->
          </label>
          <el-upload class="avatar-uploader" :auto-upload="true" accept="image/*" ref="copyUpRef" style="display: inline-block"
                     list-type="picture-card"
                     :action="upload.action"
                     :data="upload.data"
                     :file-list="copyFileList"
                     :on-preview="copyPicOnPreview"
                     :on-change="copyUpOnChange"
                     :on-success="copyUpOnSuccess"
                     :on-remove="copyUpRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="copyEditPreVisible" size="tiny" style="z-index: 9999" append-to-body>
            <img width="100%" v-if="copyEditImageUrl" :src="copyEditImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item class="marB0" label="备 注：" prop="remark">
          <el-input type="textarea" :rows="3" v-model="copyForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editCopyCancel">取 消</el-button>
          <el-button type="primary" @click="editCopySummit()" :loading="copyLoading">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/apis'
  import util from '../../common/util'
  export default {
    name: 'followUp',
    data() {
      return {
        requestParams: {
          taskId: '',
          name: '',
          status: ''
        },
        objDetails: [],
        followTaskList: [],
        taskDialogVisible: false,
        copyDialogVisible: false,
        acceptLoading: false,
        copyFileList: [],
        copyEditImageUrlObj: '',
        copyEditImageUrl: '',
        copyEditPreVisible: false,
        copyRules: {
          content: [
            {required: true, message: '请输入文案内容', trigger: 'blur'},
            { min: 3, max: 2000, message: '内容长度在3 到 2000个字符', trigger: 'blur'}
          ],
          //fileID: [{required: false, message: '请输入作者', trigger: 'blur'}]
        },
        copyLoading: false,
        copyForm: {
          content: '',
          remark: '',
          task_id: '',
          toutiao_id: '',
          content_id: '',
        },
        copyIds: [],
        upload: {
          action: API.uploadFile,
          data: {},
        },
        addFormVisible: false,
        addFormRules: {
          content: [
            {required: true, message: '请输入跟进记录内容', trigger: 'blur'},
            { min: 3, max: 20, message: '内容长度在3 到 200个字符', trigger: 'blur'}
          ],
          fileID: [
            {required: false, message: '请输入作者', trigger: 'blur'}
          ]
        },
        addLoading: false,
        dealLoading: false,
        imgPreview: '',
        addForm: {
          content: '',
          file_id: '',
          toutiao_id: '',
          task_id: ''
        },
        taskForm: {
          remark: ''
        },
        taskRules: {
          remark: [{required: true, type: 'string', min: 2, max: 100, message: '备注内容须在 2 个到100个字符以内', trigger: 'blur'}]
        },
      }
    },
    methods: {
      followList(i,row){
        let that = this;
        //let id = row.id;
        //let tdID = row.toutiao_id;
        this.followTabVisible = true;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          task_id: this.$route.params.taskId,
          toutiao_id: this.$route.params.ttId,
          user_id: user.user_id,
          token: user.token,
          page: that.follow_page,
          size: that.follow_size
        };
        API.taskFollowList(params).then(function(rs){
          if(rs.code === 0){
            let data = rs.data.rows;
            for(let i = 0; i< data.length; i++){
              data[i].imgView = API.baseImage + data[i].file_url;
              data[i].copy_img = [];
              let copyContent = data[i].case_content;
              if(copyContent == '' || null){
                data[i].copy_img.push(API.baseImage + data[i].file_url);
              }else {
                let imgUrlObj = copyContent.file_urls;
                for(let j = 0; j< imgUrlObj.length; j++){
                  data[i].copy_img.push(API.baseImage + imgUrlObj[j]);
                }
              }
            }
            console.log(rs);
            //that.followTaskList.createDate = util.formatDate.format(data.create_time, 'yyyy-MM-dd mm:ss');
            that.followTaskList = data;
            that.follow_totals = rs.data.total;
          }else {
            that.$message.error({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      details(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          id: this.$route.params.taskId,
          toutiao_id: this.$route.params.ttId,
          user_id: users.user_id,
          token: users.token
        };
        API.taskDetail(params).then(function(rs){
          //console.log(rs);
          if(rs.code === 0){
            let res = rs.data;
            res.img_view = [];
            for(let i = 0; i< res.file_urls.length; i++) {
              res.img_view.push(API.baseImage + res.file_urls[i]);
            }
            res.price_type === 1 ? res.priceTypeStr = '硬广价格': res.priceTypeStr = '软广价格';
            res.status === 1 ? res.statusStr = '待接单' : res.status === 2 ? res.statusStr = '已接单': res.status == 3 ? res.statusStr = '已完成'
              :res.status === 4 ? res.statusStr = '拒绝接单 ': res.statusStr = '-';
            res.remark === '' ? res.remark = '暂无' : res.remark;
            res.content === '' ? res.content = '暂无' : res.content;
            res.start_time == '' ? resStaDate = '暂无' : res.resStaDate = util.formatDate.format(res.start_time, 'yyyy-MM-dd hh:mm');
            //res.pay_status === 0 ? res.payStr = '未支付': res.pay_status = 1 ? res.payStr = '已支付': res.pay_status = 2 ? res.payStr = '退款': '-';
            res.end_time == '' ? resEndDate = '暂无' : res.resEndDate = util.formatDate.format(res.end_time, 'yyyy-MM-dd hh:mm');
            res.create_time == '' ? resCreDate = '暂无' : res.resCreDate = util.formatDate.format(res.create_time, 'yyyy-MM-dd hh:mm');
            that.objDetails = rs.data;
            console.log(rs);
          }
        }, function(err){
          that.$message.error({showClose: true, message:rs.message || err.toString(), duration: 2000});
        }).catch((err) => {
          console.log(err);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      editCopyShow(taskID, topID, contentID){
        console.log('toutiaoID:'+topID +',,contentID:'+ contentID)
        this.copyForm.toutiao_id = topID;
        this.copyForm.task_id = taskID;
        this.copyForm.content_id = contentID;
        let id = this.copyForm.content_id;
        this.copyQuery(id, 2)
      },
      addRecord(){
        this.addForm.toutiao_id = this.$route.params.ttId;
        this.addForm.task_id = this.$route.params.taskId;
        this.addFormVisible = true;
      },
      acceptTask(){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          token: user.token,
          user_id: user.user_id,
          id: that.requestParams.taskId,
          toutiao_id: that.requestParams.toutiaoId,
          status: that.requestParams.status
        };
        this.$confirm('确定要接受此任务吗？', '提示', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.acceptLoading = true;
          API.taskDeals(params).then((rs) => {
            console.log(rs);
            if(rs.code === 0){
              that.$message({type: 'success',message: '提交成功！', duration: 3000});
              that.acceptLoading = false;
              that.details();
              that.requestParams.status = 2;
            }else {
              that.$message({message: rs.message, type:'error'});
              that.acceptLoading = false;
            }
          }).catch((err) => {
            that.$message.error({showClose: true, message: '请求出现异常' || err.toString(), duration: 3000});
          })
        }).catch(() => {});
      },
      refuseTask(){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          token: user.token,
          user_id: user.user_id,
          id: that.requestParams.taskId,
          toutiao_id: that.requestParams.toutiaoId,
          //status: that.requestParams.status,
          status: 2,
          remark: that.taskForm.remark
        };
        that.$refs.taskForm.validate((valid) => {
          if(valid){
            that.dealLoading = true;
            API.taskDeals(params).then((rs) => {
              console.log(rs);
              if(rs.code === 0){
                that.$message({type: 'success', message: '提交成功！', duration: 3000});
                that.$refs['taskForm'].resetFields();
                that.dealLoading = false;
                that.taskDialogVisible = false;
                that.details();
                that.requestParams.status = 3;
                console.log(that.requestParams)
              }else {
                that.$message({message: rs.message, type:'error'});
                that.addFormVisible = true;
                that.dealLoading = false;
              }
            }).catch((err) => {
              that.$message({type: 'error', showClose: true, message: err.toString() || '请求出现异常', duration: 3000});
            });
          }else{
            return false;
          }
        });
      },
      returnBack(){
        this.$router.push({path: '/task/list'});
      },
      editContentShow(){
        let that = this;
        let id = that.objDetails.id;
        let toutiaoID = that.objDetails.toutiao_id;
        this.copyForm.task_id = id;
        this.copyForm.toutiao_id = toutiaoID;
        //console.log(that.objDetails)
        that.copyQuery(id, 1);
      },
      copyQuery(id, type){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: user.user_id,
          token: user.token,
          id: id,
          type : type
        };
        API.taskCppyQuery(params).then((rs) => {
          console.log(rs);
          if(rs.code === 0){
            that.copyForm.content = rs.data.content;
            //that.copyEditImageUrlObj = rs.data.file_urls;
            let arr = [];
            let imgObjs = rs.data.file_urls;
            let idsObj = rs.data.file_ids;
            for(let i = 0;i< idsObj.length; i++){
              for(let k in imgObjs){
                if(idsObj[i] == k){
                  arr.push({
                    id: k,
                    url: API.baseImage + imgObjs[k]
                  })
                }
              }
            }
            console.log(arr)
            that.copyFileList = arr;
            that.copyDialogVisible = true;
            that.copyIds = rs.data.file_ids;
          }else {
            that.copyDialogVisible = false;
            that.$message({message: rs.message, type:'warning'});
          }
        }).catch((err) => {
          that.$message.error({showClose: true, message:rs.message || err.toString(), duration: 3000});
        });
      },
      editCopySummit(){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: user.user_id,
          token: user.token,
          task_id: that.copyForm.task_id,
          toutiao_id: that.copyForm.toutiao_id,
          content: that.copyForm.content,
          remark: that.copyForm.remark,
          file_ids: that.copyIds
        };
        console.log(params)
        that.$refs.copyFormRef.validate((valid) => {
          if(valid){
            that.copyLoading = true;
            API.taskCppyEdit(params).then((rs) => {
              console.log(rs);
              if(rs.code === 0){
                that.$message({type: 'success', message: '文案修改成功！', duration: 3000});
                that.copyLoading = false;
                that.$refs['copyFormRef'].resetFields();
                that.copyDialogVisible = false;
                that.followList();
              }else {
                that.$message({message: rs.message, type:'warning', showClose: true});
                that.copyDialogVisible = true;
                that.copyLoading = false;
              }
            }).catch((err) => {
              that.copyLoading = false;
              that.$message.error({showClose: true, message: '请求出现异常' || err.toString(), duration: 3000});
            });
          }else{
            return false;
          }
        });
      },
      closeDialog(done){
        let that = this;
        //that.$confirm('message', 'title', {}).then
        done();
        that.copyForm.ids = [];
      },
      editCopyCancel(){
        //function(done){},
        this.copyForm.ids = [];
        this.copyDialogVisible = false;
      },
      addTaskSubmit(){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let addParams = {
          user_id: user.user_id,
          token: user.token,
          task_id: that.addForm.task_id,
          toutiao_id: that.addForm.toutiao_id,
          content: that.addForm.content,
          file_id: that.addForm.file_id
        };
        console.log(addParams);
        that.$refs.addForm.validate((valid) =>{
          if(valid){
            that.$confirm('确定为该任务添加跟进记录吗？', '提示', {confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              API.taskRecordAdd(addParams).then((rs) => {
                console.log(rs);
                if(rs.code === 0){
                  that.$message.success('任务跟进记录提交成功！');
                  that.$refs['addForm'].resetFields();
                  that.addFormVisible = false;
                  this.followList();
                }else {
                  that.$message({
                    message: rs.message,
                    type:'error'
                  });
                  that.addFormVisible = true;
                  that.addLoading = false;
                }
              }).catch((err) => {
                //that.loading = false;
                that.$message.error({showClose: true, message: err.toString() || '请求出现异常', duration: 3000});
              });
            }).catch(() => {})
          }else{
            that.$message('添加任务跟进记录失败，请检查！');
            return false;
          }
        })
      },
      copyPicOnPreview(file) {
        this.copyEditImageUrl = file.url;
        this.copyEditPreVisible = true;
      },
      copyUpOnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        //console.info('res.data', res.data)
        console.info('file', file)
        if(res.code === 0){
          this.copyIds = [];
          this.copyIds.push(res.data.id);
          this.$message.success("文案图片上传成功！");
        }else{
          this.$message.warning(res.message);
        }
      },
      copyUpRemove(file, fileList) {
        console.log(file);
        for(let j = 0;j < this.copyFileList.length; j++){
          if(this.copyFileList[j].id == file.id){
            this.copyFileList.splice(j, 1);
          }
        }
        console.log(this.copyFileList)
        let editImg = [];
        for(let k = 0;k < this.copyFileList.length; k++){
          editImg.push(this.copyFileList[k].id);
        }
        console.info('editImg', editImg)
        this.copyIds = editImg;
      },
      copyUpOnChange(file, list){
        console.log("——————————icon change——————————")
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        this.upload.data = {
          user_id: users.user_id,
          token: users.token,
          type: 5
          //file: file.raw
        };
        this.$nextTick(() =>{
          this.$refs.copyUpRef.submit();
        });
        //this.uploadCommon(file, 5);
      },
      addRecordUpOnChange(file, fileList){
        this.imgPreview = URL.createObjectURL(file.raw);
        this.uploadCommon(file, 6);
      },
      addUpIconOnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        if(res.code === 0){
          this.addForm.file_id = res.data.id || '';
          this.$message.success("图片上传成功");
        }else{
          this.$message.warning(res.message);
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.warning('上传头像图片仅支持 JPG，PNG 格式！');
        }
        if (!isLt2M) {
          this.$message.warning('上传头像图片大小不能超过 2MB！');
        }
        return isJPG && isLt2M;
      },
      uploadCommon(file, type){
       // debugger
        if(file.status == 'ready') {
          console.log("ready")
          let users = JSON.parse(window.sessionStorage.getItem('access-user'));
          this.upload.data = {
            user_id: users.user_id,
            token: users.token,
            type: type
            //file: file.raw
          };
          this.$nextTick(() => {
            if(type === 5){
              this.$refs.copyUpRef.submit();
            }else if(type === 6){
              this.$refs.addRecordRef.submit();
            }
          });
          console.log(this.upload.data);
        }else if(file.status == 'fail'){
          this.$message.error("图片上传出错，请稍后重试！")
        }
      }
    },
    mounted() {
      this.details();
      this.followList();
      //this.$nextTick(() => {});
    },
    created(){
      this.requestParams.taskId = this.$route.params.taskId;
      this.requestParams.name = this.$route.params.name;
      this.requestParams.status = this.$route.params.status;
      this.requestParams.toutiaoId = this.$route.params.ttId;
      console.log(this.requestParams)
      //this.followList();
    },
    watch: {
      '$route': 'followList'
    },
    //computed: {},
    filters: {
      formatDate: function (arg) {
        if(!arg) return '暂无时间';
        return util.formatDate.format(arg, 'yyyy-MM-dd hh:mm:ss');
      }
    },
  }
</script>
<style lang="scss" scoped>
  .followUp{
    .btnlist{
      margin-left: 10px;
    }
    .back{
      margin-left: 10px;
    }
    .details{
      .title span{
        display: inline-block;
        font-size: 18px;
        margin: 5px 0 15px;
      }
      .padlt15{
        padding-left: 15px;
      }
    }
    p{
      color: #303133;
      line-height: 30px;
      margin: 16px 0 5px;
    }
    .imgView{
      //border-bottom: 1px solid #ddd;
      .item{
        display: inline-block;
        .recordImage{
          width: 100px;
          height: 100px;
          padding-right: 10px;
        }
      }
      .detailsEdit{
        margin: 15px 0 10px;
      }
    }
    .recordList{
      margin: 20px 0;
      h3{
        font-size: 18px;
        font-weight: 500;
        margin: 0;
        padding: 10px 5px;
        border-bottom: 1px solid #ddd;
        i{
          font-size: 16px;
          margin: 0 3px 0 0;
        }
      }
      .content{
        margin: 20px 20px;
        border-bottom: 1px dashed #ddd;
        span{
          display: inline-block;
          margin-bottom: 10px;
        }
        .copyContent{
          display: block;
        }
        .item{
          .imgWarp{
            .recordImage{
              width: 100px;
              height: 100px;
              padding-right: 10px;
            }
          }
        }
        .bottom{
          margin: 10px 0 15px;
          .times{
            padding: 0 5px;
          }
        }
      }
    }
  }
</style>
