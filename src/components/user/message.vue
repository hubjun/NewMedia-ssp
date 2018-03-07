<template>
    <div class="message">
      <el-table :data="lists" v-loading="listLoading" stripe border style="width:100%;">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="title" label="消息标题">
          <template slot-scope="scope">
            <a  @click="cellClick(scope.row)">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" :formatter="formatDate" width="230"></el-table-column>
        <el-table-column width="130" prop="is_look" :formatter="formatIsLook" label="状态"></el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope"><span><i class="el-icon-delete icon-del" @click="deleteMsg(scope.row)"></i></span></template>
        </el-table-column>
      </el-table>
      <div class="elPagination">
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[15, 30, 60]"
                       :page-size="size"
                       layout="total, sizes, prev, pager, next"
                       :total="totals">
        </el-pagination>
      </div>

      <el-popover placeholder="top-start" width="900" v-model="detailsVisible" trigger="click">
        <div class="popTop">
          <span class="title">消息通知详情</span>
          <i class="close el-icon-close" @click="detailsVisible = false"></i>
        </div>
        <div class="details" >
          <div class="det_title">
            <h2>{{detailObj.title}}</h2>
            <div class="publish_time">时间：{{detailObj.create_time | formatDate}}</div>
          </div>
          <div class="content">{{detailObj.content}}</div>
        </div>
      </el-popover>
    </div>
</template>

<script>
  import API from '../../api/apis'
  import util from '../../common/util'
  import {bus} from '../../bus.js'
  export default {
    name: 'message',
    data() {
      return {
        formatDate: function (row, colum) {
          return (!row.create_time || row.create_time == '') ? '暂无' : util.formatDate.format(row.create_time, 'yyyy-MM-dd hh:mm:ss ');
        },
        formatIsLook: function(row,column){
          return  row.is_look == 0 ? '未读' : '已读';
        },
        page: 1,
        size: 15,
        totals: 0,
        currentPage: 1,
        lists: [],
        detailObj: [],
        listLoading: false,
        detailsVisible: false
      }
    },
    methods: {
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
            let totalCounts = rs.data.total;
            bus.$emit('totalCounts', totalCounts);
          }else{
            that.$message({message:rs.msg, type:'warning', duration: '4000'})
          }
        }).catch(() => {})
      },

      cellClick(row, colum){
        let that = this;
        that.detailsVisible = true;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params ={
          user_id: users.user_id,
          token: users.token,
          message_id:row.id
        };
        API.msgDetails(params).then((rs) => {
          if(rs.code === 0){
            that.detailObj = rs.data;
            that.messageCount();
          }else {
            that.$message({type:'warning', showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          that.$message({type:'error', message: err.toString() || '请求出现异常', showClose: true, duration: 3000});
        })
      },

      deleteMsg(row){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params ={
          user_id: users.user_id,
          token: users.token,
          message_id: row.id
        };
        this.$confirm('确认要删除该消息吗？', '提示', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.msgDel(params).then((rs) => {
            if(rs.code === 0){
              that.init();
              that.messageCount();
              that.$message({type:'success', message: '消息删除成功！', duration: 3000});
            }else {
              that.$message({type:'warning', showClose: true, message: rs.message, duration: 3000});
            }
          }).catch((err) => {
            that.$message({type:'error', message: err.toString() || '请求出现异常', showClose: true, duration: 4000});
          })
        }).catch(() => {});
      },

      handleSizeChange(val) {
        this.size = val;
        this.listLoading = true;
        this.init();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.listLoading = true;
        this.init();
      },

      init(){
        let that = this;
        let users = JSON.parse(window.sessionStorage.getItem('access-user'));
        let params = {
          user_id: users.user_id,
          token: users.token,
          page: that.page,
          size: that.size
        };
        that.listLoading = true;
        API.msgList(params).then((rs) => {
          if(rs.code === 0){
            console.log(rs);
            that.lists = rs.data.rows;
            that.totals = rs.data.total;
            that.listLoading = false;
          }else {
            that.listLoading = false;
            that.$message({type:'warning', showClose: true, message: rs.message, duration: 3000});
          }
        }).catch((err) => {
          that.$message({type:'error', showClose: true, message: err.toString() || '请求出现异常', duration: 4000});
        })
      }
    },
    mounted() {
      this.init();
      //this.$nextTick(() => {})
    },
    filters: {
      formatDate: function (arg) {
        if(!arg) return '暂无时间';
        return util.formatDate.format(arg, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    //watch: {},
    //computed: {},
    //props: {},
    //components: {},
  }
</script>
<style scoped>
  .el-table a {
    text-decoration: none;
    cursor: pointer;
    color: #333;
  }
  .el-table a:hover {
    text-decoration: underline;
  }
  .el-table .icon-del {
    color: red;
    cursor: pointer;
    padding: 0 20px;
    font-size: 15px;
    box-sizing: border-box;
  }
  .det_title {
    box-sizing: border-box;
    padding: 0 20px;
  }
  .det_title h2 {
    font-size: 18px;
    line-height: 30px;
    font-weight: 600;
    color: #000;
  }
  .det_title .publish_time {
    color: #999;
    font-size: 14px;
    line-height: 14px;
    padding-bottom: 20px;
    border-bottom: 1px dotted #ddd;
  }
  .content {
    box-sizing: border-box;
    padding:20px;
    font-size: 14px;
    color: #333;
    line-height: 28px;
  }
</style>
