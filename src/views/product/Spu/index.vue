<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动全局组件 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部，三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部的sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- sku列表 -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      //分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的操作
      show: true,
      page: 1, //分页器当前页数
      limit: 3, //每一页展示的数据
      records: [], //spu列表的数据
      total: 0, //分页器总共要展示的条数
      scene: 0, //0-2分别代表列表数据，添加或删除spu，添加sku
      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], //存储sku列表
      loading: true,
    };
  },
  methods: {
    //三级联动的自定义组件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        //清除二三级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除三级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取spu列表进行展示
        this.getSpuList();
      }
    },
    //获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      // 携带三个参数，第几页，每一页多少数据，三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //某页条数发生变化的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //发请求
      this.getSpuList();
    },
    //添加SPU按钮的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData();
    },
    //修改某一个SPU
    updateSpu(row) {
      this.scene = 1;
      //获取子组件Spuform子组件
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件回调
    changeScene({ scene, flag }) {
      //切换结构
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //删除spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //添加sku按钮的回调
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看sku的按钮回调
    async handler(spu) {
      //点击显示和隐藏
      this.dialogTableVisible = true;
      this.spu = spu;
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //隐藏加载
        this.loading = false;
      }
    },
    //关闭对话框的回调
    close(done) {
      this.loading = true;
      this.skuList = [];
      //关闭对话框
      done();
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>