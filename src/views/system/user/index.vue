<template>
  <div class="container">
    <!-- 搜索部分 -->
    <div class="seeks">
      <div class="seeks-each">
        <p>模糊查询：</p>
        <el-input v-model="seek.keywords" clearable></el-input>
      </div>
      <!-- 查询和重置按钮 -->
      <div class="seek-btns">
        <el-button size="small" type="primary" icon="el-icon-search" @click="getUserList(true)">查询</el-button>
        <el-button size="small" @click="clickReset()" icon="el-icon-refresh-left">重置</el-button>
        <el-button size="small" icon="el-icon-plus" @click="add()">
          新增</el-button>
      </div>
    </div>

    <!-- 表格部分 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%;" v-loading="loading">
        <el-table-column prop="realname" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="roles" label="岗位名称">
          <template slot-scope="scope">
            <div>{{scope.row.roles[0].title}}</div>
            <!-- <el-switch v-model="scope.row.roles[0].title"></el-switch> -->
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changeStatus(scope.row.userId)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row, scope.$index)">编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row, scope.$index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页部分  pagination-->
    <div class="pagination">
      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next" @current-change="changePage" :current-page="page"
        :page-size="size" :total="total">
      </el-pagination>
    </div>

    <!-- 新增、编辑弹窗 -->
    <div class="sub-mask">
      <el-dialog :title="maskType == 0 ? '新增角色' : '修改角色'" width="480px" :visible.sync="maskShow"
        :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <!-- 角色名称 -->
          <el-form-item label="角色名称：" prop="title" :label-width="formLabelWidth">
            <el-input v-model="form.title" style="width: 320px" placeholder="请输入角色名称" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 角色标识 -->
          <el-form-item v-if="maskType==0" label="角色标识：" prop="name" :label-width="formLabelWidth">
            <el-input v-model="form.name" style="width: 320px" placeholder="请输入角色标识" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 角色描述 -->
          <el-form-item label="角色描述：" prop="remark" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.remark" style="width: 320px" placeholder="请输入角色描述"
              autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="maskLoading" @click="maskShow = false">取 消</el-button>
          <el-button type="primary" :loading="maskLoading" @click="maskSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getUserList, addUser, updUser, delUser, switchUser } from '@/api/user'

export default {
  computed: {
    ...mapGetters([
    ])
  },
  data() {
    return {
      // 表格信息
      loading: false, // 加载中
      tableData: [], // 表格数据
      page: 1, // 当前页数
      size: 20, // 每页条数
      total: 0, // 总条数
      seek: {
        keywords: '',
      },
      tableData: [],
      status: true,

      // 弹窗信息
      roleId: '', // 编辑的ID
      maskLoading: false,
      maskShow: false, // 弹窗是否显示
      maskType: 0, // 弹窗类型 0新增 1编辑
      formLabelWidth: "100px", // 弹窗中label的宽度
      form: {  // 弹窗输入的数据
        title: "",
        name: '',
        remark: '',
      },

      rules: { // 表单校验规则
        title: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入角色标识", trigger: "blur" }],
      },
    }
  },
  mounted() {
    this.getUserList();
  },
  // filters: {
  //   filStatus: function (value) {
  //     console.log(value, 'asddddddddddddd');
  //     return value == 1 ? true : false
  //   }
  // },


  methods: {
    // 点击搜索的重置按钮
    clickReset() {
      this.seek = {
        name: "",
        status: "",
      };
      this.total = 0;
      this.page = 1;
      this.getUserList();
    },

    // 点击页码
    changePage(index) {
      console.log(index);
      this.page = index;
      this.getUserList();
    },


    // 获取列表数据
    getUserList() {
      this.loading = true
      getUserList({
        pageNum: this.page,
        pageSize: this.size,
        keywords: this.seek.keywords
      }).then(res => {
        console.log(res);
        this.tableData = res.data.list;
        this.total = res.data.total;

        this.tableData.forEach(item => {
          item.status == 1 ? item.status = true : false
        });
        this.loading = false

      }).catch(error => {
        console.log(error);
      })
    },

    // 改变状态 1-启用 0-禁用
    changeStatus(id) {
      switchUser({ adminId: id }).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
      }).catch(error => {
        console.log(error);
      })
    },

    add() {
      this.maskType = 0
      this.maskShow = true
    },

    edit(row) {
      console.log(row, 'rowrowrow');
      this.roleId = row.id;
      this.form.title = row.title;
      this.form.remark = row.remark;
      this.maskType = 1
      this.maskShow = true
    },

    del(row) {
      // 新增
      this.$confirm("是否删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delUser({
            roleId: row.id,
          })
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getUserList(); //  重新请求数据
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => { });
    },

    maskSubmit() {
      this.maskLoading = true;
      // type=0 新增  =1 修改

      if (this.maskType == 0) {
        // 新增
        addUser(this.form).then(res => {
          this.maskShow = false
          this.maskLoading = false;
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.page = 1;
          this.total = 0;
          this.getUserList();

        }).catch(error => {
          console.log(error);
        })
      } else {
        // 修改
        updUser({
          title: this.form.title,
          remark: this.form.remark,
          roleId: this.roleId,
        }).then(res => {
          console.log(res);
          this.maskShow = false
          this.maskLoading = false
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.getUserList();
        }).catch(error => {
          console.log(error);
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 200px;
}

.container {
  min-height: calc(100vh - 50px);
  padding: 25px;

  // min-height: calc(100vh - 100px);
  // margin: 25px;
  // background: #f2f2f2;
  // border-radius: 5px;
  .seeks {
    height: 80px;
    margin-bottom: 20px;
    background: #f2f2f2;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: center;

    .seeks-each {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }

    .btns {
      margin-left: 50px;
    }

  }

  .table {
    min-height: calc(100vh - 270px);
  }

  .pagination {
    height: 50px;
    margin-top: 20px;
    background: #fff;
  }
}
</style>
