<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-tabs class="finance-tabs" :span="24" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账户信息" name="info">
          <ul :data="cashData">
            <li><h3>账户余额</h3><span>{{cashData.account}}元</span></li>
            <li><h3>累计收益</h3><span>{{cashData.total_account}}元</span></li>
            <li><h3>冻结金额</h3> <span>{{cashData.frozen_account}}元</span></li>
          </ul>
          <div><el-button type="primary" plain size="medium" @click="showCashForm">提 现</el-button></div>
          <hr/>
          <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
              <el-button type="success" size="medium" @click.native="addFormVisible = true">新增银行账户</el-button>
              <span class="title">审核状态</span>
              <el-select v-model="filters.status" clearable placeholder="请选择" size="medium" @change="handleSearch" style="width: 160px;">
                <el-option
                  v-for="item in opt1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form>
          </el-col>
          <el-table :data="tableBank" @selection-change="selsChange" border stripe highlight-current-row style="width:100%" element-loading-text="努力加载中...">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="bank_number" label="收款账号"></el-table-column>
            <el-table-column prop="name" label="收款人"></el-table-column>
            <el-table-column prop="bank_name" label="收款行"></el-table-column>
            <el-table-column prop="sub_bank" label="所属支行"></el-table-column>
            <el-table-column label="图片" min-width="40">
              <template slot-scope="scope">
                <el-tooltip v-if="!scope.row.bank_file_url ==''" placement="top" effect="light">
                  <div slot="content"><img :src="scope.row.imgView" alt=""></div>
                  <el-button type="text">预览</el-button>
                </el-tooltip>
                <el-button v-if="scope.row.bank_file_url ==''" type="text">暂无图片</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="audit" min-width="50"></el-table-column>
            <el-table-column prop="remark" label="备注" :formatter="formatRemark"></el-table-column>
            <!--<el-table-column prop="updated" label="最后更新时间" :formatter="fotmatUpdated"></el-table-column>-->
            <el-table-column label="操作" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editCard(scope.$index,scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handDel(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 提现记录 -->
        <el-tab-pane label="提现记录" name="record">
          <el-table :data="withDrawList" border stripe highlight-current-row style="width:100%" element-loading-text="努力加载中...">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="bank_name" label="银行名称"></el-table-column>
            <el-table-column prop="sub_bank" label="所属支行"></el-table-column>
            <el-table-column prop="bank_number" label="银行账号"></el-table-column>
            <el-table-column prop="account" label="提现金额"></el-table-column>
            <el-table-column prop="bank_people_name" label="收款人姓名"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="withDrawAudit" min-width="50"></el-table-column>
            <el-table-column prop="remark" label="备注" :formatter="formatRemark"></el-table-column>
            <el-table-column prop="audit_time" label="审核时间" :formatter="fotmatdate1"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" :formatter="fotmatdate2"></el-table-column>
          </el-table>
          <div class="elPagination">
            <el-pagination background layout="total, sizes, prev, pager, next"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="recordCurrentPage"
                     :page-sizes="[30, 60, 100]"
                     :page-size="recordSize"
                     :total="recordTotals">
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="账务流水" name="list">
          <el-table :data="fianceListObj" border stripe highlight-current-row style="width:100%" element-loading-text="努力加载中...">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="type" label="类型" :formatter="fianceInfo"></el-table-column>
            <el-table-column prop="account" label="金额"></el-table-column>
            <el-table-column prop="pre_account" label="操作前金额"></el-table-column>
            <el-table-column prop="next_account" label="操作后金额"></el-table-column>
            <el-table-column prop="account" label="提现金额"></el-table-column>
            <el-table-column prop="remark" label="备注" :formatter="formatRemark" min-width="100"></el-table-column>
            <el-table-column prop="create_time" label="提现时间" :formatter="fianceListDate"></el-table-column>
          </el-table>
          <div class="elPagination">
            <el-pagination background layout="total, sizes, prev, pager, next"
                     @size-change="fianceSizeChange"
                     @current-change="fianceCurrentChange"
                     :current-page="fianceCurrentPage"
                     :page-sizes="[30, 50, 80]"
                     :page-size="fianceSize"
                     :total="fianceTotals">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <!-- 新增 -->
    <el-dialog title="新增账户" :visible.sync ="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
        <el-form-item label="图片附件">
          <el-upload class="avatar-uploader" accept="image/*" ref="imgRef"
                     action="upload.action"
                     data="upload.data"
                     :show-file-list="false"
                     :action="upload.action"
                     :data="upload.data"
                     :on-change="addUpOnChange"
                     :on-success="addUpIconOnSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imgPreview" :src="imgPreview" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="收款账号" prop="bank_number">
          <el-input v-model="addForm.bank_number"></el-input>
        </el-form-item>
        <el-form-item label="收款人姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="收款行名称" prop="bank_name">
          <el-input v-model="addForm.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="所属支行" prop="sub_bank">
          <el-input v-model="addForm.sub_bank"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">立即创建</el-button>
      </div>
    </el-dialog>
    <!-- 编辑卡号 -->
    <el-dialog title="编辑账户" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="110px" :rules="addFormRules" ref="editForm">
        <el-form-item label="收款账号" prop="bank_number">
          <el-input v-model="editForm.bank_number"></el-input>
        </el-form-item>
        <el-form-item label="收款人姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="收款行名称" prop="bank_name">
          <el-input v-model="editForm.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="所属支行" prop="sub_bank">
          <el-input v-model="editForm.sub_bank"></el-input>
        </el-form-item>
        <el-form-item label="图片附件">
          <el-upload class="avatar-uploader" accept="image/*" ref="editImgRef"
                     action="upload.action"
                     data="upload.data"
                     :show-file-list="false"
                     :action="upload.action"
                     :data="upload.data"
                     :on-change="editUpOnChange"
                     :on-success="editUpIconOnSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="editPreview" :src="editPreview" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 提现选择 -->
    <el-dialog title="账户提现" :visible.sync="cashFormVisible" :close-on-click-modal="false" class="cashForm">
      <el-form :model="cashForm" label-width="120px" :rules="cashFormRules" ref="cashForm">
        <!--<el-form-item label="收款账号" prop="media_bank_id">-->
          <!--<el-select v-model="cashForm.media_bank_id" placeholder="请选择">-->
            <!--<el-option v-for="item in bankObj" :key="item.media_bank_id" :label="item.account_bank" :value="item.media_bank_id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="银行账户" prop="id">
          <el-select clearable placeholder="请选择银行账户" v-model="cashForm.id" size="large">
            <el-option
              v-for="item in accounts"
              :key="item.id"
              :label="item.bank_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现金额" prop="account">
          <!--<el-input-number v-model="cashForm.account" :step="100" :min="100"></el-input-number>-->
          <el-input v-model="cashForm.account" :step="100" :min="100" max="10000" style="width: 217px;"></el-input>
        </el-form-item>
      </el-form>
      <p>注意：<span>单笔提现金额最低￥100.0</span></p>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cashFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="cashSubmit" :loading="cashLoading">确认提交</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>
<script>
  import API from '../api/apis'
  import util from '../common/util'
  export default{
    data(){
      var checkMoney = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入提现金额'));
        }else if(value < 0){
          return callback(new Error('金额不能是负数'));
        }else if(value > 100000){
          return callback(new Error('提现金额不能超过10万'));
        }else {
          callback();
        }
      }
      return {
        opt1: [{
          value: '0',
          label: '全部'
        },{
          value: '1',
          label: '待审核'
        },{
          value: '2',
          label: '审核通过'
        },{
          value: '3',
          label: '审核不通过'
        }],
        activeName: 'info',
        tabSelect: [],
        cashData:{
          amount:'00.00',
          total_account:'00.00',
          frozen_account:'00.00'
        },
        tableBank:[],
        page: 1,
        size: 10,
        totals: 0,
        filters: {
          status: ''
        },
        addFormVisible: false,
        editFormVisible: false,
        cashFormVisible: false,
        cashLoading: false,
        accounts: [],
        fianceListObj: [],
        cashForm: {
          account: '',
          id: ''
        },
        addForm:{
          name:'',
          bank_number:'',
          bank_name:'',
          sub_bank: '',
          bank_file_id: ''
        },
        imgPreview: '',
        editPreview: '',
        upload: {
          action: API.uploadFile,
          data: {}
        },
        cashFormRules: {
          account: [
            //{ required: true, message: '请输入提现金额', trigger: 'blur' },
            {type: 'string',required: true, validator: checkMoney, trigger: 'change'}
          ],
          id: [
            {type:'number', required: true, message: '请选择提现账户', trigger: 'blur' },
          ],
        },
        addFormRules: {
          bank_number: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' },
            { min: 18, max: 18, message: '请输入18位银行卡号', trigger: 'blur'}
          ],
          bank_name: [
            {required: true, message: '请输入银行卡种类名称', trigger: 'blur'},
          ],
          name:[
            { required: true, message:'请填写收款人姓名', trigger:'blur'}
          ],
          sub_bank:[
            { required: true, message:'请填写很行卡所属支行', trigger:'blur'}
          ],
          //bank_file_id:[{required: true, message:'请填写很行卡所属支行', trigger:'change'}],
        },
        addLoading:false,
        editForm:{
          id: '',
          name:'',
          bank_number:'',
          bank_name:'',
          sub_bank: '',
          bank_file_id: ''
        },
        editLoading:false,
        withDrawList: [],
        recordPage: 1,
        recordSize: 10,
        recordCurrentPage: 1,
        recordTotals: 0,
        fiancePage: 1,
        fianceSize: 10,
        fianceCurrentPage: 1,
        fianceTotals: 0
      }
    },
    methods: {
      audit: function (row, colum) {
        return (row.status == null) ? '暂无' : row.status === 0 ? '待审核 ' : row.status === 1 ?'审核通过'
          : row.status === 2 ?'审核未过': '-';
      },
      formatRemark: function (row, colum) {
        return (row.remark == null || row.remark == '') ? '暂无' : row.remark;
      },
      withDrawAudit(row,colum){
        return (row.status == null) ? '暂无' : row.status === 0 ? '待审核 ' : row.status === 1 ?'提现成功'
          : row.status === 2 ?'提现失败': '-';
      },
      fotmatdate1(row,colum){
        return (row.audit_time == null || row.audit_time == '') ? '暂无' : util.formatDate.format(row.audit_time);
      },
      fotmatdate2(row,colum){
        return (row.create_time == null || row.create_time == '') ? '暂无' : util.formatDate.format(row.create_time);
      },
      handleSearch(value){
        this.filters.status = value;
        this.initData();
      },
      fianceListDate(row, colum){
        return (row.create_time == null || '') ? '暂无' : util.formatDate.format(row.create_time);
      },
      selsChange(sels){
        //console.log(sels);
        this.tabSelect = sels;
      },
      fianceInfo(row, colum){
        return (row.type == null) ? '暂无' : row.type === 1 ? '收益 ' : row.status === 2 ?'提现' : '-';
      },
      showCashForm(){
        this.cashFormVisible = true;
        this.getAccountList();
      },
      handleClick(tab, event) {
        console.log(tab, event);
        if(tab.paneName == 'record'){
          this.recordList();
        }else if(tab.paneName == 'info'){
          this.accountInfo();
        }else if(tab.paneName == 'list'){
          this.fianceList();
        }
      },
      addSubmit(){
        this.$refs.addForm.validate((valid) =>{
          if(valid){
            this.$confirm('确定新增此很行账户吗？','提示',{type: 'warning'}).then(() => {
              this.addLoading = true;
              let users = JSON.parse(window.sessionStorage.getItem('access-user'));
              let param = {
                user_id: users.user_id,
                token: users.token,
                bank_number:this.addForm.bank_number,
                bank_name:this.addForm.bank_name,
                name:this.addForm.name,
                sub_bank:this.addForm.sub_bank,
                bank_file_id:this.addForm.bank_file_id
              };
              API.bankCardAdd(param).then((rs) => {
                if(rs.code === 0){
                  this.$message({
                    message:'提交成功！',
                    type:'success'
                  });
                  this.$refs['addForm'].resetFields();
                  this.addLoading = false;
                  this.addFormVisible = false;
                  this.initData();
                }else {
                  this.$message.warning({showClose: true, message: rs.message, duration: 2500});
                  //this.$refs['addForm'].resetFields();
                  this.addLoading = false;
                  this.addFormVisible = true;
                }
              }).catch((err) => {
                console.log(err);
                this.addLoading = false;
                this.$message.error({showClose: true, message: '请求出现异常' || err, duration: 2500});
              })
            });
          }else{
            this.$message('新增卡号失败，请检查！');
            return false;
          }
        })
      },
      editCard(i,row){
        this.editFormVisible = true;
        this.editForm.id = row.id;
        this.editPreview = API.baseImage + row.bank_file_url;
        this.editForm = Object.assign({}, row);
        console.log(this.editForm)
      },
      handDel(index,row){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          id: row.id,
          user_id: users.user_id,
          token: users.token
        };
        that.$confirm('确认要删除该银行账户吗？', '提示', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.financeDelete(params).then(function(rs){
            console.log(rs);
            if(rs.code === 0){
              that.$message({type: 'success',showClose: true, message: '删除成功！', duration: 2000});
              that.initData();
            }
          },function(err){
            that.$message.error({message: rs.message ||err.toString(), duration: 2000});
          }).catch((err) => {
            console.log(err);
            that.$message({type:'error', showClose: true, message: '请求出现异常', duration: 2000});
          })
        }).catch((err) => {
          //this.$message({showClose: true, message: '取消删除！' || err.toString() , duration: 3000});
        })
      },
      editSubmit(){
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认为该任务添加跟进记录吗？', '提示', {confirmButtonText: '确定',
              cancelButtonText: '取消', type: 'warning'}).then(() => {
              this.editLoading = true;
              let users = JSON.parse(window.sessionStorage.getItem('access-user'));
              let param = {
                id: this.editForm.id,
                user_id: users.user_id,
                token: users.token,
                bank_number: this.editForm.bank_number,
                bank_name: this.editForm.bank_name,
                name: this.editForm.name,
                sub_bank: this.editForm.sub_bank,
                bank_file_id: this.editForm.bank_file_id
              };
              API.bankCardEdit(param).then((rs) => {
                if (rs.code === 0) {
                  this.$message({
                    message: '提交成功！',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.editLoading = false;
                  this.initData();
                } else {
                  this.$message.warning({showClose: true, message: rs.message, duration: 2500});
                  //this.$refs['editForm'].resetFields();
                  this.editLoading = false;
                  this.editFormVisible = true;
                }
              }).catch((err) => {
                console.log(err);
                this.editLoading = false;
                this.$message.error({showClose: true, message: '请求出现异常，请稍后在试' || err, duration: 2500});
              })
            });
          } else {
            this.$message('新增卡号失败，请检查！');
            return false;
          }
        })
      },
      cashSubmit(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          bank_id: that.cashForm.id,
          token: users.token,
          account: that.cashForm.account
        };
        that.$refs.cashForm.validate((valid) => {
          if(valid){
            this.$confirm('确认要从该银行卡账户提现吗？', '提示', {confirmButtonText: '确定',
              cancelButtonText: '取消', type: 'warning'}).then(() => {
              API.userWithdraw(params).then(function(rs){
                console.log(rs);
                that.cashLoading = true;
                if(parseInt(rs.code) === 0){
                  that.$message({message: '提交成功！', type: 'success', duration: 3000});
                  that.cashFormVisible = false;
                  that.cashLoading = false;
                  that.$refs['cashForm'].resetFields();
                }else {
                  that.cashFormVisible = true;
                  that.cashLoading = false;
                  that.$message({showClose: true, message: rs.message, duration: 3000});
                }
              }).catch((err) => {
                console.log(err);
                that.cashLoading = false;
                that.$message.error({showClose: true, message: '请求出现异常', duration: 3000});
              });
            }).catch(() => {})
          }else {
            return false;
          }
        })

      },
      deleteCard(i,row){},
      isDefault(i,row){},
      commonOnChange(file, type){
        if(file.status == 'ready'){
          console.log("ready")
          let users = JSON.parse(window.sessionStorage.getItem('access-user'));
          this.upload.data = {
            user_id: users.user_id,
            token: users.token,
            type: 3
            //file: file.raw
          };
          if(type == 'add'){
            this.$nextTick(() => {
              this.$refs.imgRef.submit();
            });
          }else if(type == 'edit'){
            this.$nextTick(() => {
              this.$refs.editImgRef.submit();
            });
          }
          console.log(this.upload.data);
        }else if(file.status == 'fail'){
          this.$message.error("图片上传出错，请刷新重试！")
        }
      },
      addUpOnChange(file, fileList){
        console.log("——————————change——————————")
        this.imgPreview = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 'add');
      },
      addUpIconOnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        if(res.code === 0){
          this.addForm.bank_file_id = res.data.id;
          this.$message.success("图片上传成功");
        }else{
          this.$message.warning(res.message);
        }
      },
      editUpOnChange(file, fileList){
        console.log("——————————change——————————")
        this.editPreview = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 'edit');
      },
      editUpIconOnSuccess(res, file, ls){
        console.log("——————————success——————————")
        if(res.code === 0){
          this.editForm.bank_file_id = res.data.id;
          this.$message.success("头像上传成功！");
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
      accountInfo(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token
        };
        API.financeInfo(params).then(function(rs){
          console.log(rs);
          if(parseInt(rs.code) === 0){
            that.cashData = rs.data;
          }else {
            that.$message({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          //that.loading = false;
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      recordList(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token,
          page: that.recordPage,
          size: that.recordSize
        };
        API.financeWithdrawLs(params).then(function(rs){
          console.log(rs);
          if(parseInt(rs.code) === 0){
            that.withDrawList = rs.data.rows;
            that.recordTotals = rs.data.total;
          }else {
            that.$message({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          //that.loading = false;
          that.$message.error({showClose: true, message: '请求出现异常', duration: 3000});
        });
      },
      fianceList(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token,
          page: that.fiancePage,
          size: that.fianceSize
        };
        API.financeList(params).then(function(rs){
          console.log(rs);
          if(parseInt(rs.code) === 0){
            that.fianceListObj = rs.data.rows;
            that.fianceTotals = rs.total;
          }else {
            that.$message({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          that.$message({type: 'error', message: '请求出现异常', duration: 3000});
        });
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.recordSize = val;
        this.recordList();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.recordPage = val;
        this.recordList();
      },
      //账务流水
      fianceSizeChange(val) {
        this.fianceSize = val;
        this.fianceList();
      },
      fianceCurrentChange(val) {
        this.fiancePage = val;
        this.fianceList();
      },
      getAccountList(){
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let opts = {
          user_id: users.user_id,
          token: users.token,
          page: 1,
          size: 20,
          status: 2
        };
        API.bankCardList(opts).then((rs) => {
          console.log(rs)
          if(rs.code === 0){
            this.accounts = rs.data.rows;
          }else {
            this.$message({message: rs.message, duration: 3000})
          }
        }).catch((err) => {
          this.$message({message: rs.message || err,showClose: true, duration: 3000})
        })
      },
      initData(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token,
          page: that.page,
          size: that.size,
          status: that.filters.status
        };
        that.logining = true;
        API.bankCardList(params).then(function(rs){
          console.log(rs);
          let data = rs.data.rows;
          if(parseInt(rs.code) === 0){
            for(let i = 0; i< data.length; i++){
              data[i].imgView = API.baseImage + data[i].bank_file_url;
            }
            that.tableBank = data;
            that.totals = rs.data.total;
          }else {
            //that.loading = false;
            that.$message({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          //that.loading = false;
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      }
    },
    mounted() {
      this.accountInfo();
      this.initData();
    }
  }
</script>
<style lang="scss" scoped>
  .finance-tabs{
    padding-top: 5px;
  }
  .el-tab-pane ul {
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    text-align: center;
  }
  .el-tab-pane ul li {
    list-style: none;
    width: 33.3%;
    float: left;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
    margin: 20px 0 36px;
  }
  .el-tab-pane ul li:last-child{
    border-right: none;
  }
  .el-tab-pane ul li h3 {
    font-size: 20px;
    color: #333;
    font-weight: normal;
    margin: 10px 0;
  }
  .el-tab-pane ul li span {
    font-size: 16px;
    color: #2196f3;
  }
  hr {margin:30px 0 20px;}
  .toolbar{
    .title{padding-left: 10px}
  }
  .cashForm p {
    box-sizing: border-box;
    padding-left: 46px;
  }
</style>
