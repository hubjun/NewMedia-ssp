<template>
  <div class="list">
    <div class="tabList">
      <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item>头条任务</el-breadcrumb-item>
          <el-breadcrumb-item>任务列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <!--<el-button type="success" size="medium" @click="addRecord">新增跟进记录</el-button>-->
          <!--<el-button type="success" size="medium" @click="copyEditShow">修改文案</el-button>-->
          <span class="title">任务状态</span>
          <el-select v-model="filters.status" clearable placeholder="请选择" @change="handleSearch" size="medium" style="width: 160px;">
            <el-option
              v-for="item in opt1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--<el-form-item>-->
            <!--<el-button type="primary" size="medium" @click="handleSearch">查询</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </el-col>

      <el-table :data="listData" highlight-current-row v-loading="loading" @selection-change="selsChange" stripe border style="width: 100%;">
        <!--<el-table-column type="selection" min-width="30"></el-table-column>-->
        <el-table-column prop="name" label="任务名称">
        </el-table-column>
        <el-table-column prop="username" label="头条账号">
        </el-table-column>
        <el-table-column prop="type" label="任务类型" :formatter="formatType">
        </el-table-column>
        <!--<el-table-column prop="content" label="内容" min-width="110"></el-table-column>-->
        <el-table-column prop="price" label="价格(元)">
        </el-table-column>
        <el-table-column prop="price_type" label="价格类型" :formatter="formatPrice">
        </el-table-column>
        <el-table-column prop="status" label="任务状态" :formatter="formatStatus">
        </el-table-column>
        <!--<el-table-column prop="status" label="支付状态" :formatter="formatPay">-->
        <!--</el-table-column>-->
        <el-table-column prop="remark" label="备注" :formatter="formatRemark" min-width="110">
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" :formatter="formatSdate"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" :formatter="formatEdate"></el-table-column>
        <el-table-column prop="create_time" label="添加时间" :formatter="formatCdate">
        </el-table-column>
        <el-table-column label="操作" min-width="105">
          <template slot-scope="scope">
            <!--<el-button size="mini" @click="handleTask(scope.$index, scope.row)" type="text">任务处理</el-button>-->
            <!--<el-button size="mini" @click="followList(scope.$index, scope.row)" type="text">跟进记录</el-button>-->
            <el-button size="mini" @click="followRecord(scope.$index, scope.row)" type="text">任务跟进</el-button>
            <el-button size="mini" type="text" @click="handleDetails(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="elPagination">
        <el-pagination background layout="total, sizes, prev, pager, next"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[15, 30, 100]"
                       :page-size="size"
                       :total="totals">
        </el-pagination>
      </div>

      <el-dialog title="新增任务跟进记录" :visible.sync ="addFormVisible" :close-on-click-modal="false">
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
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addTaskSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <el-dialog title="头条任务处理" :visible.sync="taskDialogVisible" width="36%">
        <el-form ref="taskForm" :model="taskForm" :rules="taskRules">
          <el-form-item label="处理类型：" prop="status" class="marB12">
            <el-radio-group v-model="taskForm.status">
              <el-radio :label="1" border>接受任务</el-radio>
              <el-radio :label="2" border>拒绝任务</el-radio>
              <!--<el-radio :label="3" border>已处理</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item class="marB0" label="备 注：" prop="remark">
            <el-input type="textarea" :rows="4" v-model="taskForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="taskDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="processing()" :loading="dealLoading">提 交</el-button>
        </span>
      </el-dialog>

      <el-dialog title="任务跟进记录" :visible.sync="followTabVisible" width="80%">
        <el-table :data="followTaskList" border stripe v-loading="followTaskloading" :default-sort = "{prop: 'create_time', order: 'descending'}" element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column property="create_time" label="添加时间" min-width="90" :formatter="followDate" sortable></el-table-column>
          <el-table-column property="type" label="用户类型" :formatter="followType"></el-table-column>
          <!--<el-table-column property="user_id" label="头条用户ID"></el-table-column>-->
          <!--<el-table-column property="toutiao_id" label="头条账号ID"></el-table-column>-->
          <el-table-column property="content" label="跟进内容"></el-table-column>
          <el-table-column property="case_content.content" label="文案内容" :formatter="copyContent" show-overflow-tooltip></el-table-column>
          <el-table-column property="case_content.type" label="文案创建类型" :formatter="copyType"></el-table-column>
          <el-table-column property="case_content.type" label="文案创建人" :formatter="copyCreate" show-overflow-tooltip></el-table-column>
          <el-table-column label="文案图片">
            <template slot-scope="scope">
              <div v-for="(v, index) in scope.row.copy_img" style="padding: 0 2px;display:inline-block;">
                <el-tooltip placement="left" effect="light">
                  <div slot="content"><img :src="v" alt=""></div>
                  <el-button type="text">图片{{index + 1}}</el-button>
                </el-tooltip>
              </div>
              <el-button v-if="scope.row.copy_img.length == 0" type="text">暂无图片</el-button>
            </template>
          </el-table-column>
          <el-table-column property="status" label="状态" :formatter="followStatus"></el-table-column>
          <el-table-column label="跟进图片">
            <template slot-scope="scope">
              <el-tooltip v-if="!scope.row.file_url ==''" placement="top" effect="light">
                <div slot="content"><img :src="scope.row.imgView" alt=""></div>
                <el-button type="text">预览</el-button>
              </el-tooltip>
              <el-button v-if="scope.row.file_url ==''" type="text">暂无图片</el-button>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button v-if="scope.row.case_content ==''" type="text" size="small" @click="copyQuery(scope.$index,scope.row)">获取文案</el-button>-->
              <!--<el-button v-if="!scope.row.case_content ==''" type="text" size="small" @click="copyEditShow(scope.$index,scope.row)">修改文案</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
        <div class="elPagination">
          <el-pagination background layout="total, sizes, prev, pager, next"
                         @size-change="followSizeChange"
                         @current-change="followCurrentChange"
                         :current-page="follow_currentPage"
                         :page-sizes="[30, 60, 100]"
                         :page-size="size"
                         :total="follow_totals">
          </el-pagination>
        </div>
      </el-dialog>

      <el-dialog title="修改文案内容" :visible.sync="copyDialogVisible" width="40%">
        <el-form ref="copyFormRef" :model="copyForm" :rules="copyRules">
          <el-form-item label="内 容：" prop="content">
            <el-input type="textarea" v-model="copyForm.content" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
          </el-form-item>
          <el-form-item prop="file_ids">
            <label slot="label">
              上传图片
              <el-tooltip placement="right">
                <div slot="content">上传“文案图片”时<br/>图片支持jpg、jpeg、gif、png四种格式，图片大小不超过2M。</div>
                <i class="el-icon-info"></i>
              </el-tooltip>
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
          <el-button @click="copyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCopySummit()" :loading="copyLoading">提 交</el-button>
        </span>
      </el-dialog>

      <el-popover placement="top-start" width="900" v-model="detailsVisible" trigger="click">
        <div class="popTop">
          <span class="title">查看任务详情</span>
          <i class="close el-icon-close" @click="popClose"></i>
        </div>
        <ul class="checkMessage">
          <li><span>头条账号ID:</span>{{objDetails.toutiao_id}}</li>
          <li><span>任务名称:</span>{{objDetails.name}}</li>
          <li><span>任务类型:</span>{{objDetails.priceTypeStr}}</li>
          <li><span>头条账号:</span>{{objDetails.username}}</li>
          <li><span>价格类型:</span>{{objDetails.priceTypeStr}}元</li>
          <li><span>价  格:</span>{{objDetails.price}}元</li>
          <!--<li><span>支付状态 :</span>{{objDetails.payStr}}</li>-->
          <li><span>状  态:</span>{{objDetails.statusStr}}</li>
          <li><span>备  注:</span>{{objDetails.remark}}</li>
          <li><span>撤销时间:</span>{{objDetails.resSdate}}</li>
          <li><span>执行时间</span>{{objDetails.startTime}}</li>
          <li><span>添加时间:</span>{{objDetails.resCreDate}}</li>
          <li><span>内  容:</span>{{objDetails.content}}</li>
        </ul>
      </el-popover>
    </div>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  import API from '../../api/apis'
  import util from '../../common/util'
  export default {
    name: 'list',
    data() {
      return {
        opt1: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '待接单'
        },{
          value: '2',
          label: '已接单'
        },{
          value: '3',
          label: '已完成'
        },{
          value: '4',
          label: '拒绝接单 '
        }],
        //tabHidden: true,
        filters: {
          status: '',
          isPay: ''
        },
        tabSelect: [],
        listData: [],
        loading: false,
        page: 1,
        size: 10,
        totals: 0,
        currentPage: 1,
        objDetails: [],
        detailsVisible: false,
        addFormVisible: false,
        taskDialogVisible: false,
        copyDialogVisible: false,
        copyEditImageUrl: '',
        copyFileList: [],
        copyEditImageUrlObj: '',
        copyEditPreVisible: false,
        addLoading: false,
        addForm: {
          content: '',
          file_id: '',
          toutiao_id: ''
        },
        imgPreview: '',
        upload: {
          action: API.uploadFile,
          data: {}
        },
        addFormRules: {
          content: [
            {required: true, message: '请输入跟进记录内容', trigger: 'blur'},
            { min: 3, max: 20, message: '内容长度在3 到 200个字符', trigger: 'blur'}
          ],
          fileID: [
            {required: false, message: '请输入作者', trigger: 'blur'}
          ]
        },
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
          ids: []
        },
        taskForm: {
          status: '',
          remark: ''
        },
        dealsID: '',
        dealsStatus: '',
        dealLoading: false,
        taskRules: {
          status: [{required: true, type: 'number', message: '请选择任务处理方式', trigger: 'blur'}],
          remark: [{min: 0, max: 20, message: '文字或字符不能超过100个', trigger: 'change'}]
        },
        followTaskList: [],
        followTabVisible: false,
        followTaskloading: false,
        follow_page: 1,
        follow_size: 10,
        follow_totals: 0,
        follow_currentPage: 1,
      }
    },
    methods: {
      formatType: function (row, colum) {
        return (row.type == null) ? '暂无' : row.type === 4 ?'微头条' :'-';
      },
      formatPrice: function (row, colum) {
        return (row.price_type == null) ? '暂无': row.price_type === 1 ? '硬广价格' : '软广价格';
      },
      formatStatus: function (row, colum) {
        return (row.status == null) ? '暂无' : row.status === 1 ? '待接单' : row.status === 2 ?'已接单 '
          : row.status === 3 ?'已完成': row.status === 4 ? '拒绝接单 ': '-';
      },
      formatRemark: function (row, colum) {
        return (row.remark == null || row.remark == '') ? '暂无' : row.remark;
      },
      formatPay: function (row, colum) {
        return (row.pay_status == null || row.pay_status == '') ? '暂无' : row.pay_status === 0 ? '未支付' : row.pay_status === 2 ?'已支付' :'退款';
      },
      formatCdate: function(row,colum) {
        return (row.create_time == null) ?'暂无': util.formatDate.format(row.create_time);
      },
      formatSdate: function(row,colum) {
        return (row.start_time == null) ?'暂无': util.formatDate.format(row.start_time);
      },
      formatEdate: function(row,colum) {
        return (row.end_time == null) ?'暂无': util.formatDate.format(row.end_time);
      },
      followStatus: function (row, colum) {
        return row.status === 0 ? '未查看' : row.status === 1 ? '已查看' :'暂无';
      },
      copyType: function (row, colum) {
        return row.type === 1 ? '星媒体用户' : row.type === 2 ? 'g3用户' :'暂无';
      },
      copyContent: function (row, colum) {
        return row.content_id === 0 ? '暂无' : row.case_content.content;
      },
      copyCreate: function (row, colum) {
        return row.type === 2 ? 'g3用户：' + row.user_id :'暂无';
      },
      followType: function (row, colum) {
        return row.type === 1 ? '星媒体用户' : row.type === 2 ? 'G3用户' :'暂无';
      },
      followDate: function (row, colum) {
        return (row.create_time == '' || null) ? '暂无': util.formatDate.format(row.create_time, 'yyyy-MM-dd hh:mm');
      },
      selsChange(sels){
        console.log(sels);
        this.tabSelect = sels;
      },
      addRecord(){
        let seleLength = this.tabSelect.length;
        if(seleLength === 0){
          this.$message({message: '请选择一个列表任务！', type: 'warning', duration: 3000});
        }else if(seleLength > 1 ){
          this.$message({message: '提交任务跟进记录时，只能选择一个任务哦！', type: 'warning', duration: 4000});
        }else{
          this.addFormVisible = true;
          this.addForm.toutiao_id = this.tabSelect[0].toutiao_id;
        }
      },
      addTaskSubmit(){
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let addParams = {
          user_id: user.user_id,
          token: user.token,
          task_id: this.tabSelect[0].id,
          toutiao_id: this.addForm.toutiao_id,
          content: this.addForm.content,
          file_id: this.addForm.fileID
        };
        console.log(addParams);
        this.$refs.addForm.validate((valid) =>{
          if(valid){
            this.$confirm('确定为该任务添加跟进记录吗？', '提示', {confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              API.taskRecordAdd(addParams).then((rs) => {
                console.log(rs);
                if(rs.code === 0){
                  this.$message.success('任务跟进记录提交成功！');
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.initData();
                }else {
                  this.$message({message: rs.message, type:'warning'});
                  this.addFormVisible = true;
                  this.addLoading = false;
                }
              }).catch((err) => {
                //that.loading = false;
                this.$message.error({showClose: true, message: err.toString() || '请求出现异常', duration: 3000});
              });
            }).catch(() => {})
          }else{
            this.$message('添加任务跟进记录失败，请检查！');
            return false;
          }
        })
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
        //console.log(editImg)
        this.copyForm.ids = editImg;
      },
      addRecordUpOnChange(file, fileList){
        this.imgPreview = URL.createObjectURL(file.raw);
        this.uploadCommon(file, 6);
      },
      copyPicOnPreview(file) {
        this.copyEditImageUrl = file.url;
        this.copyEditPreVisible = true;
      },
      copyUpOnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        if(res.code === 0){
          this.copyForm.ids.push(res.data.id);
          this.$message.success("文案图片上传成功！");
        }else{
          this.$message.warning(res.message);
        }
      },
      copyUpOnChange(file, list){
        this.uploadCommon(file, 5);
      },
      uploadCommon(file,type){
        console.log("——————————change——————————")
        //this.imgPreview = URL.createObjectURL(file.raw);
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
          this.$message.error("图片上传出错，请刷新重试！")
        }
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
      handleSearch(value){
        this.total = 0;
        this.page = 1;
        this.filters.status = value;
        this.initData();
      },
      handleDetails(i,row){
        let that = this;
        that.detailsVisible = true;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          id: row.id,
          toutiao_id: row.toutiao_id,
          user_id: users.user_id,
          token: users.token
        };
        API.taskDetail(params).then(function(rs){
          console.log(rs);
          if(rs.code === 0){
            let res = rs.data;
            res.price_type === 1 ? res.priceTypeStr = '硬广价格': res.priceTypeStr = '软广价格';
            res.status === 1 ? res.statusStr = '待接单' : res.status === 2 ? res.statusStr = '已接单': res.status == 3 ? res.statusStr = '已完成'
              :res.status === 4 ? res.statusStr = '拒绝接单 ': res.statusStr = '-';
            res.remark === '' ? res.remark = '暂无' : res.remark;
            res.content === '' ? res.content = '暂无' : res.content;
            //res.pay_status === 0 ? res.payStr = '未支付': res.pay_status = 1 ? res.payStr = '已支付': res.pay_status = 2 ? res.payStr = '退款': '-';
            res.end_time == '' ? resSdate = '暂无' : res.resSdate = util.formatDate.format(res.end_time, 'yyyy-MM-dd hh:mm:ss');
            res.create_time == '' ? resCreDate = '暂无' : res.resCreDate = util.formatDate.format(res.create_time, 'yyyy-MM-dd hh:mm:ss');
            res.start_time == '' ? startTime = '暂无' : res.startTime = util.formatDate.format(res.start_time, 'yyyy-MM-dd hh:mm:ss');
            that.objDetails = rs.data;
          }
        }, function(err){
          that.$message.error({showClose: true, message:rs.message || err.toString(), duration: 2000});
        }).catch((err) => {
          console.log(err);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      popClose(){
        this.detailsVisible = false;
      },
      handleTask(i,row){
        this.taskDialogVisible = true;
        this.dealsID = row.id;
        this.dealsStatus = row.status;
      },
      processing(){
        let deals = this.taskForm.status;
        let dealsStatus = this.dealsStatus;
        if(dealsStatus !== 1){
          this.$message({type: 'warning', message: '当前任务已处在非待接单状态下，不能处理！',duration: 3000})
        }else if(deals == ''){
          this.$message.warning({showClose: true, message: '请选择任务处理类型！', duration: 3000});
        }else if(deals === 2 && this.taskForm.remark == ''){
          this.$message({type: 'warning', message: '拒绝任务时，备注不能是空！'})
        }else {
          let user = JSON.parse(window.sessionStorage.getItem('access-user'));
          let params = {
            user_id: user.user_id,
            token: user.token,
            id: this.dealsID,
            remark: this.taskForm.remark,
            status: this.taskForm.status
          };
          this.$refs.taskForm.validate((valid) => {
            if(valid){
              this.dealLoading = true;
              API.taskDeals(params).then((rs) => {
                console.log(rs);
                if(rs.code === 0){
                  this.$message.success({message: '任务处理成功！', duration: 3000});
                  this.$refs['taskForm'].resetFields();
                  this.dealLoading = false;
                  //this.initData();
                }else {
                  this.$message({
                    message: rs.message,
                    type:'error'
                  });
                  this.addFormVisible = true;
                  this.dealLoading = false;
                }
              }).catch((err) => {
                //that.loading = false;
                this.$message.error({showClose: true, message: err.toString() || '请求出现异常', duration: 3000});
              });
            }else{
              return false;
            }
          });
        }
      },

      copyEditShow(){
        let that = this;
        let seleLength = that.tabSelect.length;
        if(seleLength === 0){
          this.$message({message: '请选择一个需要修改文案的任务！', type: 'warning', duration: 3000});
        }else if(seleLength > 1 ){
          this.$message({message: '修改任务文案时，只能选择一个任务哦！', type: 'warning', duration: 4000});
        }else{
          that.copyQuery();
          this.copyForm.task_id = that.tabSelect[0].id;
          this.copyForm.toutiao_id = that.tabSelect[0].toutiao_id;
        }
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
          file_ids: that.copyForm.ids
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
      copyQuery(i,row){
        let that = this;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: user.user_id,
          token: user.token,
          id: that.tabSelect[0].id,
          type : 1
        };
        API.taskCppyQuery(params).then((rs) => {
          console.log(rs);
          if(rs.code === 0){
            //that.$message.success({message: '文案获取成功！', duration: 3000});
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
            that.copyForm.ids = rs.data.file_ids;
          }else {
            that.copyDialogVisible = false;
            that.$message({message: rs.message, type:'warning'});
          }
        }).catch((err) => {
          that.$message.error({showClose: true, message:rs.message || err.toString(), duration: 3000});
        });
      },

      followList(i,row){
        let that = this;
        let id = row.id;
        let tdID = row.toutiao_id;
        this.followTabVisible = true;
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          task_id: id,
          toutiao_id: tdID,
          user_id: user.user_id,
          token: user.token,
          page: that.follow_page,
          size: that.follow_size
        };
        that.followTaskloading = true;
        API.taskFollowList(params).then(function(rs){
          if(rs.code === 0){
            let data = rs.data.rows;
            for(let i = 0; i< data.length; i++){
              data[i].imgView = API.baseImage + data[i].file_url;
              data[i].copy_img = [];
              let copyContent = data[i].case_content;
              if(copyContent == '' || null){
                data[i].copy_img = [];
              }else {
                let imgUrlObj = copyContent.file_urls;
                for(let j = 0; j< imgUrlObj.length; j++){
                  data[i].copy_img.push(API.baseImage + imgUrlObj[j]);
                }
              }
            }
            console.log(rs);
            that.followTaskList = data;
            that.follow_totals = rs.data.total;
            //debugger
            that.followTaskloading = false;
          }else {
            that.followTaskloading = false;
            that.$message.error({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          that.followTaskloading = false;
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      followRecord(i,row){
        let taskID = row.id;
        let ttID = row.toutiao_id;
        let name = row.name;
        let status = row.status;
        this.$router.push({name: 'follow' ,path: '/task/follow', params: {taskId: taskID, ttId: ttID, name: name, status: status}});
        //this.tabHidden = false;
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.size = val;
        this.initData();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page = val;
        this.initData();
      },
      followSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.follow_size = val;
        //this.initData();
      },
      followCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.follow_page = val;
        //this.initData();
      },
      initData(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token,
          page: that.page,
          size: that.size,
          pay_status: that.filters.isPay,
          status: that.filters.status
        };
        that.logining = true;
        API.topTaskList(params).then(function(rs){
          console.log(rs);
          if(parseInt(rs.code) === 0){
            that.listData = rs.data.rows;
            that.totals = rs.data.total;
          }else {
            that.loading = false;
            that.$message({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          that.loading = false;
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      }
    },
    mounted() {
      //console.log(this.tabHidden)
      this.initData();
      //this.$nextTick(() => {})
    },
    watch: {},
    computed: {},
//    beforeRouteEnter (to, from, next) {
//      next(vm => {
//        // 通过 `vm` 访问组件实例
//        console.log(vm)
//        vm.tabHidden = true;
//      })
//    },
  }
</script>
<style lang="scss" scoped>
  .el-form-item__content{
    position: static !important;
  }
  .toolbar{
    /*.title{padding-left: 10px}*/
  }
</style>
