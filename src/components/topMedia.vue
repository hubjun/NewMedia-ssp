<template>
    <div class="topMedia">
      <!--<el-row></el-row>-->
      <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item>头条账号</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col class="topButtonWarp">
        <el-button type="success" size="medium" @click="handleAdd">添加头条号</el-button>
      </el-col>

      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <span class="title">是否接单</span>
            <el-select v-model="filters.isOpen" clearable placeholder="请选择" size="medium" style="width: 110px;">
              <el-option
                v-for="item in opt1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="title">审核状态</span>
            <el-select v-model="filters.aduit" clearable placeholder="请选择" size="medium" style="width: 110px;">
              <el-option
                v-for="item in opt2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-form-item>
              <el-input v-model="filters.name" placeholder="头条账号/名称" size="medium" style="width: 166px;" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      <!--table-->
      <el-table :data="listData" highlight-current-row v-loading="loading" stripe border style="width: 100%;">
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="username" label="头条账号">
          <template slot-scope="scope">
            <el-tooltip v-if="!scope.row.photo_file_url ==''" placement="right" effect="light">
              <div slot="content"><img :src="scope.row.photoView" alt=""></div>
              <img class="photoImg" :src="scope.row.photoView" alt="">
            </el-tooltip>
            <el-tooltip v-if="!scope.row.qr_code_file_url ==''" placement="right" effect="light">
              <div slot="content"><img class="largeQR" :src="scope.row.QRView" alt=""></div>
              <img class="QRImg" :src="scope.row.QRView" alt="">
            </el-tooltip>
            <!--<img class="QRImg" :src="scope.row.QRView" alt="">-->
            <span class="mediaName">{{scope.row.username}}</span>
            <el-button v-if="scope.row.photo_file_url ==''" type="text">暂无头像</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="follower" label="粉丝数" :formatter="formatFans">
        </el-table-column>
        <el-table-column prop="string_price" label="硬广价格">
        </el-table-column>
        <el-table-column prop="soft_price" label="软广价格">
        </el-table-column>
        <el-table-column prop="is_open_status" label="是否接单" :formatter="formatOpen">
        </el-table-column>
        <el-table-column prop="status" label="审核状态" :formatter="formatAudit">
        </el-table-column>
        <el-table-column prop="admin_remarks" label="备注" :formatter="formatRemark" min-width="130">
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" :formatter="formatAdate">
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button size="mini"
              @click="handleEdit(scope.$index, scope.row)" type="text">编辑</el-button>
            <el-button size="mini" type="text"
              @click="handleDetails(scope.$index, scope.row)">详情</el-button>
            <el-button size="mini" type="text"
              @click="handDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="elPagination">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[30, 60, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next"
          :total="totals">
        </el-pagination>
      </div>

      <el-dialog title="添加头条号" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addRules">
          <el-form-item label="头 条 号" prop="username">
            <el-input v-model="addForm.username" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item label="主页地址" prop="home_addr">
            <el-input placeholder="请输入地址" v-model="addForm.home_addr" style="width: 60%">
              <template slot="prepend">https://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="粉丝数量" prop="follower">
            <el-input-number v-model="addForm.follower" controls-position="right" :min="0" :max="1000000"></el-input-number>
          </el-form-item>
          <el-form-item label="所属区域" prop="city_id">
            <el-select clearable v-model="addForm.province_id" @change="provinceChanges" filterable placeholder="选择/搜索省份" style="width: 150px">
              <el-option
                v-for="item in objProvice"
                :key="item.province_id"
                :label="item.name"
                :value="item.province_id">
              </el-option>
            </el-select>
            <el-select v-model="addForm.city_id" filterable placeholder="选择/搜索城市" style="width: 150px">
              <el-option
                v-for="item in objCity"
                :key="item.city_id"
                :label="item.name"
                :value="item.city_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业分类" prop="category_id">
            <el-select v-model="addForm.category_id" clearable placeholder="请选择" size="large">
              <el-option v-for="item in formCate"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否接单" prop="is_open_status">
            <el-radio-group v-model="addForm.is_open_status">
              <el-radio :label="1" border>接单</el-radio>
              <el-radio :label="0" border>不接单</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--<span slot="label">硬广告价</span>-->
          <!--<el-tooltip placement="right">-->
          <!--  <div slot="content">多行信息第二行信息</div>-->
          <!--</el-tooltip>-->
          <el-form-item label="硬广告价" prop="string_price">
            <label slot="label">
              硬广告价
              <el-tooltip placement="right">
                <div slot="content">指对应账号以多图头条文形式将 硬广广告内容推送给自己粉丝一次的价格。<br/>（价格为0则该位置不接单）</div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </label>
            <el-input v-model="addForm.string_price" style="width: 217px" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="软广价格" prop="soft_price">
            <label slot="label">
              软广价格
              <el-tooltip placement="right">
                <div slot="content">指对应账号以多图头条文形式将 软广广告内容推送给自己粉丝一次的价格。<br/>（价格为0则该位置不接单）</div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </label>
            <el-input v-model="addForm.soft_price" style="width: 217px" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="头条号简介" prop="introduce">
            <el-input type="textarea" v-model="addForm.introduce" style="width: 80%"
                      :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入内容">
            </el-input>
          </el-form-item>
          <el-form-item label="二维码" prop="qr_code_file_id" style="display: inline-block;">
            <label slot="label">
              二维码
              <el-tooltip placement="right">
                <div slot="content">请直接使用头条账号“账号信息”里的二维码，图片支持jpg、jpeg、png三种格式，图片大小不超过2M。<br/></div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </label>
            <el-upload class="avatar-uploader" accept="image/*" ref="QRRef"
                       :show-file-list="false"
                       :action="upload.action"
                       :data="upload.data"
                       :on-preview="addQROnPreview"
                       :on-change="addQROnChange"
                       :on-success="addQROnSuccess"
                       :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
              <!--<i class="el-icon-plus"></i>-->
              <img v-if="addQRImageUrl" :src="addQRImageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传头像" prop="photo_file_id" style="display: inline-block;">
            <el-upload class="avatar-uploader" accept="image/*" ref="iconRef"
                       action="upload.action"
                       data="upload.data"
                       :show-file-list="false"
                       :action="upload.action"
                       :data="upload.data"
                       :on-change="addUpOnChange"
                       :on-success="addUpIconOnSuccess"
                       :on-error="uploadOnError"
                       :on-progress="uploadOnProgress" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="粉丝截图" prop="follower_file_id">
            <label slot="label">
              粉丝截图
              <el-tooltip placement="right">
                <div slot="content">
                  <span>上传“粉丝截图”时，请务必确定你上传的截图中同时包括了粉丝数和头条号名称<br/>否则我们无法确定您提交账号的粉丝准确性。图片支持jpg、jpeg、png三种格式，大小不超过2M。<br/></span>
                  <div class="imgPreview"><img src="../assets/images/fans1.png" alt=""></div>
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </label>
            <el-upload class="avatar-uploader" :auto-upload="true" accept="image/*" ref="fansRef"
                       list-type="picture-card"
                       :action="upload.action"
                       :data="upload.data"
                       :on-preview="addPicOnPreview"
                       :on-change="uploadOnChange2"
                       :on-success="addUpFansOnSuccess"
                       :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" size="tiny" style="z-index: 9999" append-to-body>
              <img width="100%" v-if="dialogImageUrl" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">立即创建</el-button>
          <el-button @click.native="addFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="头条号编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editRules">
          <el-form-item label="头 条 号" prop="username">
            <el-input v-model="editForm.username" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="主页地址" prop="home_addr">
            <el-input placeholder="请输入地址" v-model="editForm.home_addr" style="width: 60%">
              <template slot="prepend">https://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="粉丝数量" prop="follower">
            <el-input-number v-model="editForm.follower" controls-position="right" :min="0" :max="1000000"></el-input-number>
          </el-form-item>
          <el-form-item label="所属区域" prop="city_id">
            <el-select v-model="editForm.province_id" @change="provinceChanges" filterable clearable placeholder="选择/搜索省份" style="width: 150px">
              <el-option
                v-for="item in objProvice"
                :key="item.province_id"
                :label="item.name"
                :value="item.province_id">
              </el-option>
            </el-select>
            <el-select v-model="editForm.city_id" filterable clearable placeholder="选择/搜索城市" style="width: 150px">
              <el-option
                v-for="item in objCity"
                :key="item.city_id"
                :label="item.name"
                :value="item.city_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业分类" prop="category_id">
            <el-select v-model="editForm.category_id" clearable placeholder="请选择" size="large">
              <el-option
                v-for="item in formCate"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否接单" prop="is_open_status">
            <el-radio-group v-model="editForm.is_open_status">
              <el-radio :label="1" border>接单</el-radio>
              <el-radio :label="0" border>不接单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="硬广价格" prop="string_price">
            <el-input v-model="editForm.string_price" style="width: 217px" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="软广价格" prop="soft_price">
            <el-input v-model="editForm.soft_price" style="width: 217px" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="头条号简介" prop="introduce">
            <el-input type="textarea" v-model="editForm.introduce" style="width: 80%"
                      :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入内容">
            </el-input>
          </el-form-item>
          <el-form-item label="二维码" prop="qr_code_file_id" style="display: inline-block;">
            <el-upload class="avatar-uploader" accept="image/*" ref="QRRef"
                       action="upload.action"
                       data="upload.data"
                       :show-file-list="false"
                       :action="upload.action"
                       :data="upload.data"
                       :on-change="editQROnChange"
                       :on-success="editUpQROnSuccess"
                       :on-error="uploadOnError"
                       :on-progress="uploadOnProgress" :before-upload="beforeAvatarUpload">
              <img v-if="editQRImageUrl" :src="editQRImageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传头像" prop="photo_file_id" style="display: inline-block;">
            <!--:auto-upload="false"-->
            <el-upload class="avatar-uploader" accept="image/*" ref="iconRef"
                       action="upload.action"
                       data="upload.data"
                       :show-file-list="false"
                       :action="upload.action"
                       :data="upload.data"
                       :on-change="editUpOnChange"
                       :on-success="editUpIconOnSuccess"
                       :on-error="uploadOnError"
                       :on-progress="uploadOnProgress" :before-upload="beforeAvatarUpload">
              <img v-if="editImageUrl" :src="editImageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="粉丝截图" prop="follower_file_id">
            <el-upload class="avatar-uploader" accept="image/*" ref="fansRef"
                       action="upload.action"
                       data="upload.data"
                       :show-file-list="false"
                       :action="upload.action"
                       :data="upload.data"
                       :on-change="uploadOnChange2"
                       :on-success="editUpFansOnSuccess"
                       :on-error="uploadOnError"
                       :on-progress="uploadOnProgress" :before-upload="beforeAvatarUpload">
              <img v-if="editFansImageUrl" :src="editFansImageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="editDialogVisible" size="tiny" style="z-index: 9999" append-to-body>
              <img width="100%" v-if="editDialogImageUrl" :src="editDialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确认提交</el-button>
          <el-button @click.native="editFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <el-popover placement="top-start" width="900" v-model="detailsVisible" trigger="click">
        <div class="popTop">
          <span class="title">查看详细信息</span>
          <i class="close el-icon-close" @click="popClose"></i>
        </div>
        <ul class="checkMessage">
          <li><span>头条号:</span>{{objDetails.username}}</li>
          <li><span>头  像:</span><img class="imgIcon" :src="objDetails.icon" alt=""></li>
          <li><span>粉丝数:</span>{{objDetails.followerStr}}</li>
          <li><span>主页地址:</span>{{objDetails.home_addr}}</li>
          <li><span>硬广价格:</span>{{objDetails.string_price}}元</li>
          <li><span>软广价格:</span>{{objDetails.soft_price}}元</li>
          <li><span>是否接单:</span>{{objDetails.openStr}}</li>
          <li><span>省ID:</span>{{objDetails.province_id}}</li>
          <li><span>城市ID:</span>{{objDetails.city_id}}</li>
          <li><span>审核状态:</span>{{objDetails.statusStr}}</li>
          <li><span>备  注:</span>{{objDetails.admin_remarks}}</li>
          <li><span>添加时间:</span>{{objDetails.create_time}}</li>
          <li><span>粉丝截图:</span><img :src="objDetails.fansImage" alt=""></li>
        </ul>
      </el-popover>
    </div>
</template>

<script>
  import API from '../api/apis'
  import util from '../common/util'
  export default {
    name: 'topMedia',
    data() {
      return {
        opt1: [{
          value: '全部',
          label: ''
        }, {
          value: '2',
          label: '接单'
        },{
          value: '1',
          label: '不接单'
        }],
        opt2: [{
          value: '全部',
          label: ''
        },{
          value: '1',
          label: '待审核 '
        },{
          value: '2',
          label: '审核通过'
        },{
          value: '3',
          label: '不通过'
        }],
        filters: {
          name: '',
          isOpen: '',
          aduit: ''
        },
        loading: false,
        listData: [],
        page: 1,
        currentPage: 1,
        size: 10,
        totals: 0,
        dialogImageUrl: '',
        editFansImageUrl: '',
        editDialogImageUrl: '',
        addQRImageUrl: '',
        editQRImageUrl: '',
        dialogVisible: false,
        editDialogVisible: false,
        upload: {
          action: API.uploadFile,
          //headers: [],
          data: {}
        },
        addFormVisible: false,
        editFormVisible: false,
        imageUrl: '',
        imageUrl2: '',
        editImageUrl: '',
        editImageUrl2: '',
        addLoading: false,
        editLoading: false,
        objProvice: [],
        objCity: [],
        formCate: [],
        addForm: {
          username: '',
          home_addr: '',
          introduce: '',
          follower: '',
          is_open_status: 1,
          string_price: '',
          soft_price: '',
          province_id: '',
          city_id: '',
          category_id: '',
          photo_file_id: '',
          qr_code_file_id: '',
          follower_file_id: ''
        },
        editForm: {
          id: '',
          username: '',
          home_addr: '',
          introduce: '',
          follower: '',
          string_price: '',
          is_open_status: '',
          soft_price: '',
          province_id: '',
          city_id: '',
          category_id: '',
          photo_file_id: '',
          qr_code_file_id: '',
          follower_file_id: ''
        },
        addFormRules: {
          username: [
            {required: true, message: '请输入头条号名称', trigger: 'blur'},
            { min: 3, max: 20, message: '长度在3 到 20个字符', trigger: 'blur'}
          ],
          home_addr: [{ required: true, message: '主页地址不能是空', trigger: 'blur'}],
          introduce: [{ min: 0, max: 100, message: '简介不能超过100个字符', trigger: 'blur'}],
          city_id:[
            {type: 'number',required: true, message:'请选择所属区域', trigger:'change'}
          ],
          category_id:[
            {type: 'number',required: true, message:'请选择所属行业分类', trigger:'change'}
          ],
          follower:[
            {type: 'number',required: true, message:'请填写粉丝数量', trigger:'change'}
          ],
          is_open_status: [{type: 'number', required: true, message: '请选择是否接单', trigger: 'blur' }],
          string_price: [{ required: true, message: '请填写硬广价格', trigger: 'blur' }],
          soft_price: [{ required: true, message: '请填写软广价格', trigger: 'blur' }],
          //photo_file_id: [{type: 'mumber', required: true, message: '请填上传头像', trigger: 'blur' }],
          //qr_code_file_id: [{type: 'mumber', required: true, message: '请填上传二维码', trigger: 'blur' }],
          //follower_file_id: [{type: 'mumber', required: true, message: '请填上传粉丝截图', trigger: 'blur' }],
          //price: [{ required: true, validator: validatePrice, trigger: 'change' }]
        },
        detailsVisible: false,
        objDetails: []
      }
    },
    props: {},
    components: {},
    methods: {
      formatFans: function (row, colun) {
        return (row.follower == null) ? '暂无' : util.fansFormat(row.follower);
      },
      formatOpen: function (row, colun) {
        return (row.is_open_status == null) ? '-': row.is_open_status == '1' ? '接单' : '不接单';
      },
      formatAudit: function (row, colum) {
        return (row.status == null) ? '暂无' : row.status === 0 ? '待审' : row.status === 1? '通过' : '不通过';
      },
      formatRemark: function (row, colum) {
        return (row.admin_remarks == null || row.admin_remarks == '') ? '暂无' : row.admin_remarks;
      },
      formatAdate: function(row,colum) {
        return (row.create_time == null) ?'暂无': util.formatDate.format(row.create_time);
      },
      handleAdd(){
        this.addFormVisible = true;
        this.getAllProvince();
        this.getFormCate();
      },
      provinceChanges(id){
        console.log(id)
        this.getCityByid(id);
      },
      //粉丝截图
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      addPicOnPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      addQROnPreview(file) {
        this.QRImageUrl = file.url;
      },
      editPicOnPreview(file) {
        this.editDialogImageUrl = file.url;
        this.editDialogVisible = true;
      },
      uploadOnChange2(file){
        console.log("——————————change——————————")
        //this.editFansImageUrl = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 3);
      },
      //头像上传
      uploadOnProgress(e, file){
        //console.log(e.percent.file);
      },
      addUpIconOnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        if(res.code === 0){
          this.addForm.photo_file_id = res.data.id;
          this.$message.success("头像上传成功");
        }else{
          this.$message.warning(res.message);
        }
      },
      addUpFansOnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        if(res.code === 0){
          this.addForm.follower_file_id = res.data.id;
          this.$message.success("粉丝图片上传成功");
        }else{
          this.$message.warning(res.message);
        }
      },
      addUpOnChange(file, fileList){
        console.log("——————————change——————————")
        this.imageUrl = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 1);
      },
      editUpIconOnSuccess(res, file, ls){
        console.log("——————————success——————————")
        if(res.code === 0){
          this.editForm.photo_file_id = res.data.id;
          this.$message.success("头像上传成功！");
        }else{
          this.$message.warning(res.message);
        }
      },
      editUpFansOnSuccess(res, file, ls){
        console.log("——————————success——————————")
        if(res.code === 0){
          this.editForm.follower_file_id = res.data.id;
          this.$message.success("粉丝图片上传成功！");
        }else{
          this.$message.warning(res.message);
        }
      },
      addQROnSuccess(res,file,list){
        console.log("——————————icon success——————————")
        if(res.code === 0){
          this.addForm.qr_code_file_id = res.data.id;
          this.$message.success("二维码上传成功");
        }else{
          this.$message.warning(res.message);
        }
      },
      editUpOnChange(file, fileList){
        console.log("——————————change——————————")
        this.editImageUrl = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 1);
      },
      addQROnChange(file, fileList){
        console.log("——————————change——————————")
        this.addQRImageUrl = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 2);
      },
      editQROnChange(file, fileList){
        console.log("——————————change——————————")
        this.editQRImageUrl = URL.createObjectURL(file.raw);
        this.commonOnChange(file, 2);
      },
      editUpQROnSuccess(res, file, ls){
        console.log("——————————success——————————")
        if(res.code === 0){
          this.editForm.qr_code_file_id = res.data.id;
          this.$message.success("头像上传成功！");
        }else{
          this.$message.warning(res.message);
        }
      },
      commonOnChange(file, type){
        console.log(file);
        if(file.status == 'ready'){
          console.log("ready")
          let users = JSON.parse(window.sessionStorage.getItem('access-user'));
          this.upload.data = {
            user_id: users.user_id,
            token: users.token,
            type: type
            //file: file.raw
          };
          this.$nextTick(() => {
            if(type === 1){
              this.$refs.iconRef.submit();
            }else if(type === 3){
              this.$refs.fansRef.submit();
            }else if(type === 2){
              this.$refs.QRRef.submit();
            }
          });
          console.log(this.upload.data);
        }else if(file.status == 'fail'){
          this.$message.error("图片上传出错，请刷新重试！")
        }
      },
      uploadOnError(e,file){
        console.log("——————————error——————————")
        console.log(e)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message({type:'warning', message: '上传头像图片仅支持 JPG，JPEG，PNG 格式！', duration: 4000});
        }
        if (!isLt2M) {
          this.$message({type:'warning', message: '上传头像图片大小不能超过 2MB！', duration: 4000});
        }
        return isJPG && isLt2M;
      },

      addSubmit(){
        let user = JSON.parse(window.sessionStorage.getItem('access-user'));
        let addForm = {
          user_id: user.user_id,
          token: user.token,
          username: this.addForm.username,
          home_addr: this.addForm.home_addr,
          introduce: this.addForm.introduce,
          follower: this.addForm.follower,
          string_price: this.addForm.string_price,
          is_open_status: this.addForm.is_open_status,
          soft_price: this.addForm.soft_price,
          province_id: this.addForm.province_id,
          city_id: this.addForm.city_id,
          category_id: this.addForm.category_id,
          photo_file_id: this.addForm.photo_file_id,
          qr_code_file_id: this.addForm.qr_code_file_id,
          follower_file_id: this.addForm.follower_file_id
        };
        console.log(addForm);
        this.$refs.addRules.validate((valid) => {
          if(valid){
            this.$confirm('确认要新增该头条号吗？', '提示', {confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              API.createTopAccount(addForm).then((rs) => {
                console.log(rs);
                if(rs.code === 0){
                  this.$message.success('提交成功！');
                  this.$refs['addRules'].resetFields();
                  this.addFormVisible = false;
                  this.initData();
                }else {
                  this.$message({
                    message: rs.message,
                    type:'error'
                  });
                  this.addFormVisible = true;
                }
              }).catch((err) => {
                //that.loading = false;
                this.$message({type: 'error', showClose: true, message: err.toString() || '请求出现异常', duration: 3000});
              });
            }).catch(() => {})
          }else{
            this.$message('创建头条号失败，请检查！');
            return false;
          }
        });
        //this.$refs.upload.submit();
      },
      handleEdit(index,row){
        this.editFormVisible = true;
        this.editQRImageUrl = API.baseImage + row.qr_code_file_url;
        this.editImageUrl = API.baseImage + row.photo_file_url;
        this.editFansImageUrl = API.baseImage + row.follower_file_url;
        this.editForm.id = row.id;
        //this.editForm.is_open_status = row.is_open_status;
        this.editForm = Object.assign({}, row);
        console.log(this.editForm);
        this.getAllProvince();
        this.getCityByid(row.province_id);
        this.getFormCate();
      },
      editSubmit(){
        this.$refs.editRules.validate((valid) =>{
          if(valid){
            this.$confirm('确定要提交更改吗？', '提示', {type: 'warning'}).then(() =>{
              this.editLoading = true;
              let users = JSON.parse(window.sessionStorage.getItem('access-user'));
              //let params = Object.assign(this.editForm);
              let params = {
                user_id: users.user_id,
                token: users.token,
                id: this.editForm.id,
                username: this.editForm.username,
                home_addr: this.editForm.home_addr,
                introduce: this.editForm.introduce,
                follower: this.editForm.follower,
                is_open_status: this.editForm.is_open_status,
                string_price: this.editForm.string_price,
                soft_price: this.editForm.soft_price,
                province_id: this.editForm.province_id,
                city_id: this.editForm.city_id,
                category_id: this.editForm.category_id,
                photo_file_id: this.editForm.photo_file_id,
                qr_code_file_id: this.editForm.qr_code_file_id,
                follower_file_id: this.editForm.follower_file_id
              };
              console.log(params);
              //this.$refs['editRules'].resetFields();
              API.editTopAccount(params).then((rs) => {
                if(rs.code === 0){
                  this.$message.success({
                    showClose: true,
                    message: '更新成功！',
                    duration: 2500
                  });
                  this.editLoading = false;
                  this.editFormVisible = false;
                  this.initData();
                }else{
                  this.$message.error(rs.msg);
                  this.editLoading = false;
                  //this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                }
              }).catch((err) => {
                this.editLoading = false;
                this.$message.warning({showClose: true, message: err.toString(), duration: 3000});
              });
            }).catch(() => {});
          }else {
            this.$message.warning('头条号编辑失败，请检查！');
            return false;
          }
        });
      },

      handleDetails(index,row){
        let that = this;
        that.detailsVisible = true;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          id: row.id,
          user_id: users.user_id,
          token: users.token
        };
        API.topAccDetails(params).then(function(rs){
          console.log(rs);
          if(rs.code === 0){
            let res = rs.data;
            res.is_open_status === 1 ? res.openStr = '接单': res.openStr = '不接单';
            res.status === 0 ? res.statusStr = '待审' : res.status === 1 ? res.statusStr = '审核通过': res.statusStr = '不通过';
            res.admin_remarks === '' ? res.admin_remarks = '暂无' : res.admin_remarks;
            res.icon = API.baseImage + res.photo_file_url;
            res.fansImage = API.baseImage + res.follower_file_url;
            res.followerStr = res.follower === '' ? '暂无粉丝' : util.fansFormat(res.follower);
            that.objDetails = rs.data;
          }
        }, function(err){
          that.$message.error({showClose: true, message: err.toString() || rs.message, duration: 2000});
        }).catch((err) => {
          console.log(err);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },

      handDel(index,row){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          id: row.id,
          user_id: users.user_id,
          token: users.token
        };
        that.$confirm('确认要删除该头条号吗？', '提示', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.topAccDelete(params).then(function(rs){
            console.log(rs);
            if(rs.code === 0){
              that.$message({showClose: true, message: '删除成功！'});
              that.initData();
            }else {
              that.$message({showClose: true, message: rs.message, duration: 3000});
            }
          }, function(err){
            that.$message.error({showClose: true, message: err.toString() || rs.message, duration: 3000});
          }).catch((err) => {
            console.log(err);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 3000});
          })
        }).catch((err) => {
          //that.$message({showClose: true, message: '取消删除！' || err.toString() , duration: 3000});
        })
      },

      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.initData();
      },

      getAllProvince(){
        API.getProvince().then((rs) => {
          console.log(rs)
          if(rs.code === 0){
            this.objProvice = rs.data;
          }else {
            this.$message({message: rs.message, duration: 3000})
          }
        }).catch((err) => {
          this.$message({message: rs.message || err,showClose: true, duration: 3000})
        })
      },
      getCityByid(id){
        let param = {province_id: id};
        API.getCity(param).then((rs) => {
          console.log(rs)
          if(rs.code === 0){
            this.objCity = rs.data;
          }else {
            this.$message({message: rs.message, duration: 3000})
          }
        }).catch((err) => {
          this.$message({message: rs.message || err,showClose: true, duration: 3000})
        })
      },
      getFormCate(){
        API.getTopCategory().then((rs) => {
          console.log(rs)
          if(rs.code === 0){
            this.formCate = rs.data;
          }else {
            this.$message({message: rs.message, duration: 3000})
          }
        }).catch((err) => {
          this.$message({message: rs.message || err,showClose: true, duration: 3000})
        })
      },

      initData() {
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token,
          page: that.page,
          size: that.size,
          username: that.filters.name,
          is_open_status: that.filters.isOpen,
          status: that.filters.aduit
        };
        that.logining = true;
        API.topAccount(params).then(function(rs){
          console.log(rs);
          if(rs.code === 0){
            let data = rs.data.rows;
            for(let i = 0; i< data.length; i++){
              data[i].photoView = API.baseImage + data[i].photo_file_url;
              data[i].QRView = API.baseImage + data[i].qr_code_file_url;
            }
            that.listData = data;
            that.totals = rs.data.total;
          }
          else {
            that.loading = false;
            that.$message.error({showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          console.log(err);
          that.loading = false;
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
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
      popClose(){
        this.detailsVisible = false;
      }
    },
    mounted() {
      //this.$nextTick(() => {})
      this.handleSearch();
    },
    watch: {},
    computed: {}
  }
</script>
<style lang="scss" scoped>
  img.photoImg{
    width: 45px !important;
    height: 45px !important;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  img.QRImg{
    width: 20px !important;
    height: 20px !important;
  }
  img.largeQR{
    width: 200px !important;
    height: 200px !important;
  }
  .imgPreview{
    margin: 8px 0 0 2px;
    img{}
  }
  .mediaName{
    display: inline-block;
  }
.checkMessage{
  .imgIcon{
    width: 150px;
    height: 150px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
}
/*.el-tooltip__popper{*/
  /*padding: 10px !important;*/
/*}*/
</style>
