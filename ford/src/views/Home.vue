<template>
  <el-container style=" border: 0px solid ;height: 97.9vh ">
    <el-aside style="height: auto;width: 200px;background-color:#001528">
      <div class="logo_span" style="height:75px;">
        <div class="logo" style="position: relative;width: 165px;left: 10px;top: -5px">
          <img src="../assets/logo.png" alt="" style="position:relative;top:18px;width: 50px;height: 50px">
          <span style="font-size: large;color: white">线索平台</span>
        </div>
      </div>
      <el-menu background-color="#304156" text-color="#ffffff" class="platform_avatar">
        <el-submenu index="">
          <template slot="title" style="text-align: center">线索列表</template>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container style="background-color: white;height: auto">
      <el-header
          style="text-align: right; font-size: 20px ; position:relative; top:15px;border-bottom: 1px solid lightgray;box-shadow: 0px 15px 10px -15px lightgrey">

          <i class="el-icon-switch-button" @click="exit()"></i>
          <el-input v-model="username" @click.native="exit()" readonly="true"
                    style="position:relative;border:none;font-size:large;width:10rem;">
          </el-input>

      </el-header>

      <el-main style="margin: 0;padding: 0;position: relative;top: 20px">

        <div id="padding" style="padding: 40px;position: relative">
          <div>

            <div id="panel_div" style="position:relative; top:-20px;height: 40px;width: 1000px">
              <div style="padding: 10px 0;display: inline" id="mobile">
                <span>手机号：</span>
                <el-input style="width: 200px;" placeholder="请输入手机号" v-model="mobile"></el-input>
              </div>

              <div style="position: relative;left: 25px;padding: 10px 0;display: inline" id="city">
                <span>城市：</span>
                <div class="block" style="display: inline;">
                  <el-cascader size="large" :options="options" v-model="city" clearable="true">
                  </el-cascader>
                </div>
              </div>

              <span style="position: absolute;top: 8px;left: 580px">经销商:</span>
              <el-select v-model="value" placeholder="请选择" clearable="true" style="position: absolute;left: 642px"
                         @change="subShipForm" >
                <el-option v-for="item in distributor_options" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>

              <div style="padding: 10px 0;left:360px;display: inline;position:relative;" id="CreateDate">
                <span>创建时间：</span>
                <div class="block" style="display: inline;position: relative;">
                  <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期"
                                  end-placeholder="结束日期" value-format="timestamp" >
                  </el-date-picker>
                </div>
              </div>

              <div id="button_div" style="position:relative;width: 220px;top: -40px;left: 1350px">
                <el-button class="ml-5" type="primary" id="search" @click="load">查询</el-button>
                <el-button class="ml-5" type="" id="reset" @click="reset">重置</el-button>
                <div id="export_div" style="display: inline-block;position: relative;top: 0px;left: 10px">
                  <!--                  <download-excel-->
                  <!--                      class="export-excel-wrapper"-->
                  <!--                      :data="tableData"-->
                  <!--                      :fields="json_fields"-->
                  <!--                      :header="title"-->
                  <!--                      name="数据.xls"-->
                  <!--                  >-->
                  <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
                  <el-button type="primary" @click="exportExecl">导出</el-button>
                  <!--                  </download-excel>-->
                </div>
                <!--                <div id="export_div" style="display: inline-block;position: relative;top: -40px;left: 237px">-->
                <!--                  <download-excel-->
                <!--                      class="export-excel-wrapper"-->
                <!--                      :data="download"-->
                <!--                      :fields="json_fields"-->
                <!--                      :header="title"-->
                <!--                      name="全部数据.xls"-->
                <!--                  >-->
                <!--                    &lt;!&ndash; 上面可以自定义自己的样式，还可以引用其他组件button &ndash;&gt;-->
                <!--                    <el-button type="primary" @click="downloadxls">全部导出</el-button>-->
                <!--                  </download-excel>-->
                <!--                </div>-->
              </div>
            </div>
          </div>

          <el-table :data="tableData">
            <el-table-column prop="id" label="序号" width="150">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" width="220">
            </el-table-column>
            <el-table-column prop="displayCity" label="购车城市" width="230">
            </el-table-column>
            <el-table-column prop="dealerName" label="经销商名称" width="380">
            </el-table-column>
            <el-table-column prop="dealerCode" label="经销商代码" width="220">
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" width="auto">
            </el-table-column>

          </el-table>


        </div>
        <div class="block" style="position:relative;text-align:right;right:10rem;bottom:0.5rem;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                         :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

-*
<script>
import {provinceAndCityData} from 'element-china-area-data';
import request from "@/utils/request";

export default {
  created() {
    this.load()
  },
  watch: {
    city() {
      request.get("https://rw.velo.com.cn/caft/api/dealer/fetch", {
        params: {
          code: this.city[1]
        }
      }).then(res => {
        // console.log(res)
        const dealername = [];
        const dealercode = [];
        const dealerindex = [];
        const dealeroptions = {}
        if (res.data.length > 0) {
          for (let item of res.data) {
            dealername.push(item.fullname)
          }
        }
        // console.log(dealername)
        for (let [index] of res.data.entries()) {
          dealerindex.push(index)
        }
        // console.log(dealerindex)


        this.distributor_options = dealername.map(((name, index) => ({
          value: '选项' + index,
          label: name
        })))

        console.log(this.distributor_options)
        // if (res.data.length > 0) {
        //   for (let item of res.data) {
        //     dealername.push(item.fullname)
        //   }
        // }
        // if (res.data.length > 0) {
        //   for (let item of res.data) {
        //     dealercode.push(item.code)
        //   }
        // }
        // console.log(dealerindex)
        // console.log(dealercode)
        // console.log(dealername)
        // this.distributor_index = dealerindex
        // this.distributor = dealername
        // this.distributor_code = dealercode
        // this.distributor_options= {dealerindex,dealername,dealercode}
        // console.log(this.distributor_options)
      })
    }
  },
  methods: {
    subShipForm(vId) {
      let obj = {};
      obj = this.distributor_options.find(item => {
        return item.value === vId;
      });
      console.log(obj.label);
      this.dealerName = obj.label
    }
    ,
    exit() {
      localStorage.clear()
      this.$router.push('/Login')
    }
    ,
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
      this.pageSize = pageSize;
      this.load()
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`);
      this.page = page;
      this.load()
    },
    load() {

      // console.log(this.page, this.pageSize, this.value, "查询")
      request.get("https://rw.velo.com.cn/caft/api/member/query", {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          mobile: this.mobile,
          Code: this.city[1],
          beginTime: this.time[0],
          endTime: this.time[1],
          dealerName: this.dealerName,
          dealerCode: this.dealerCode
        }
      }).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.page = res.data.page
        this.pageSize = res.data.pageSize
        // console.log(this.value[0], this.value[1])
      })
    },
    reset() {
      this.mobile = ""
      this.city = ""
      this.value = ""
      this.page = "1"
      this.dealerName = ""
      this.distributor_options = ""
      this.time = ""
      this.beginTime = ""
      this.endTime = ""
      this.load()
    }
    // handleChange() {
    //   // var citycode = "";
    //   // for (let i = 0; i < this.city.length; i++) {
    //   //   citycode += CodeToText[this.city[i]];
    //   // }
    //   // console.log(this.city)//打印区域码所对应的属性值即中文地址
    // }
    // downloadxls() {
    //   request.get("http://58.32.35.107:3000/member/query", {
    //     params: {
    //       page: "1",
    //       pageSize: "99",
    //
    //     }
    //   }).then(res => {
    //     this.download = res.data.data
    //     console.log(this.download)
    //     this.DetailsForm = this.download.map((ele) => {
    //       let obj = {
    //         id: ele.id,
    //         name: ele.name,
    //         mobile: ele.mobile,
    //         displayCity: ele.displayCity,
    //         createTime: ele.createTime,
    //       };
    //       return obj;
    //     });
    //   })
    // }
    ,
    exportExecl() {
      let bT = this.time[0] === undefined ? "" : this.time[0]
      let eT = this.time[1] === undefined ? "" : this.time[1]
      let cD = this.city[1] === undefined ? "" : this.city[1]
      window.open(`https://rw.velo.com.cn/caft/api/member/download?&mobile=${this.mobile}&code=${cD}&token=${window.localStorage.getItem('accessToken')}&endTime=${eT}&beginTime=${bT}&page=1&pageSize=99999`, "_blank")
    },
    // exportExcel() {
    //   this.DetailsForm = this.tableData.map((ele) => {
    //     let obj = {
    //       id: ele.id,
    //       name: ele.name,
    //       mobile: ele.mobile,
    //       displayCity: ele.displayCity,
    //       createTime: ele.createTime,
    //     };
    //     return obj;
    //   });
    // }
  },

  data() {
    // const item = {
    //   date: '2016-05-02',
    //   name: '王小虎',
    //   address: '上海市普陀区金沙江路 1518 弄'
    // };
    return {
      title: "数据",
      json_fields: {
        序号: "id",
        姓名: "name",
        手机号: "mobile",
        城市: "displayCity",
        创建时间: "createDate",
      },
      time: "",
      DetailsForm: [],
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      options: provinceAndCityData,
      mobile: "",
      createDate: "",
      city: "",
      value: '',
      download: [],
      distributor: [],
      distributor_code: [],
      distributor_index: [],
      distributor_options: [],
      dealerCode: "",
      dealerName: "",
      username: localStorage.getItem('user')
    }
  }
}
</script>

<style>
.el-header .el-input .el-input__inner {
  border: none;
  padding: 5px;
}

.el-range-editor .el-range-input {
  text-align: left;
}

body {
  height: auto;
  width: auto;
  background-color: lightgray;
}

html,
body,
div {
  margin: 0;
  padding: 0;
}
</style>