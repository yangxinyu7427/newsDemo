<template>
  <div class="container">
    <el-container>
      <!-- 左侧布局 -->
      <el-aside class="left-aside">
        <div class="execute-button-div">
          <el-button @click="showData" class="add-button">获取今日新闻数据</el-button>
        </div>
        <el-select v-model="selectedComponentType" placeholder="选择任务类型">
          <el-option
              v-for="(type, index) in componentTypes"
              :key="index"
              :label="type.label"
              :value="type.value"
          ></el-option>
        </el-select>
        <div class="execute-button-div">
          <el-button @click="addWidget" class="add-button">添加任务</el-button>
        </div>
        <el-collapse class="collapse-container">
          <el-collapse-item v-for="(widget, ) in widgets" :key="widget.id" :title="widget.title"
                            class="collapse-item">
            <el-form label-position="left" class="collapse-el-item">
              <!-- 任务1 -->
              <el-form-item v-if="widget.type === '1'" label="选择类别">
                <el-select v-model="widget.settings.value">
                  <el-option label="军事" value="military"></el-option>
                  <el-option label="非军事" value="non_military"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '1'" label="开启攒批">
                <el-checkbox v-model="widget.settings.checked"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '1'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '1'">
                <el-input type="textarea" :rows="5" :value="widget.sql"></el-input>
              </el-form-item>
              <!-- 任务2 -->
              <el-form-item v-if="widget.type === '2'" label="模型选择（多选）">
                <el-select v-model="widget.settings.models" multiple>
                  <el-option label="线性回归" value="lr"></el-option>
                  <el-option label="随机梯度下降" value="sgd"></el-option>
                  <el-option label="朴素贝叶斯" value="nb"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="选择价值范围">
                <el-select v-model="widget.settings.value">
                  <el-option label="低" value="1"></el-option>
                  <el-option label="中" value="3"></el-option>
                  <el-option label="高" value="5"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="开启查询内冗余消除">
                <el-checkbox v-model="widget.settings.checked"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '2'">
                <el-input type="textarea" :rows="5" :value="widget.sql"></el-input>
              </el-form-item>
              <!-- 任务3 -->
              <el-form-item v-if="widget.type === '3'" label="选择模型加速策略">
                <el-select v-model="widget.settings.value">
                  <el-option label="剪枝" value="1"></el-option>
                  <el-option label="量化" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '3'" label="开启模型加载自动外提">
                <el-checkbox v-model="widget.settings.checked"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '3'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '3'">
                <el-input type="textarea" :rows="5" :value="widget.sql"></el-input>
              </el-form-item>
              <!-- 任务4 -->
              <el-form-item v-if="widget.type === '4'" label="新闻选择">
                <el-input v-model="widget.settings.text"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="选择价值范围">
                <el-select v-model="widget.settings.value">
                  <el-option label="低" value="1"></el-option>
                  <el-option label="中" value="3"></el-option>
                  <el-option label="高" value="5"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="返回新闻条数">
                <el-input v-model="widget.settings.num"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="开启查询间冗余消除">
                <el-checkbox v-model="widget.settings.checked"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '4'">
                <el-input type="textarea" :rows="10" :value="widget.sql"></el-input>
              </el-form-item>
            </el-form>
            <div class="execute-button-div">
              <el-button @click="updateChart(widget)" class="execute-button">执行</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>

      <!-- 右侧布局 -->
      <el-main class="right-main">
        <el-container direction="vertical">
          <el-header style="height: 50px;">查询结果</el-header>
          <el-footer v-if="showNewsCount" class="result-footer">
            <el-input v-model="newsCountText" :disabled="true" class="news-count-input"></el-input>
          </el-footer>
          <el-main class="table-main">
            <el-table :data="tableData" border stripe> 
              <el-table-column v-for="(value, key) in tableColumns" :key="key" :prop="value" :label="value"></el-table-column>
            </el-table>
          </el-main>
          <el-header style="height: 50px;">优化效果</el-header>
          <el-footer class="chart-footer">
            <!-- 底部图表 -->
            <div class="chart-box" v-for="(chartData, index) in chartDatas" :key="index">
              <div id="chart" style="height: 400px;"></div>
            </div>
            <div class="pic-container" v-if="this.showedComponentType === '2'">
              <div>
                <el-select v-model="selectedImage" placeholder="选择图片" @change="changeImage">
                  <el-option label="model-lr" value="model-lr"></el-option>
                  <el-option label="model-nb" value="model-nb"></el-option>
                  <el-option label="model-sgd" value="model-sgd"></el-option>
                </el-select>
                <el-image :src=selectedImageSource class="left-image" fit="fill"></el-image>
              </div>
              <div>
                <el-image :src=this.png_opted class="right-image"></el-image>
              </div>
            </div>
            <div class="pic-container" v-if="this.showedComponentType === '4'">
              <el-header style="height: 50px;">缓存命中率</el-header>
              <el-header style="height: 20px;">model-sgd:42%</el-header>
              <el-header style="height: 20px;">model-summary:20%</el-header>
            </div>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import {task4Data, task2Data, chartDatas,NewsData,task1Data,task3Data } from './data/data.js';
import * as echarts from 'echarts'
import png_opted from '../src/pic/model-opted.png';
import png_lr from '../src/pic/model-lr.png';
import png_nb from '../src/pic/model-nb.png';
import png_sgd from '../src/pic/model-sgd.png';

export default {
  mounted() {
    this.initChart()
  },
  data() {
    return {
      showedComponentType:'',
      png_opted:png_opted,
      png_lr:png_lr,
      png_nb:png_nb,
      png_sgd:png_sgd,
      selectedImage: 'model-lr', // 默认选择第一张图片
      tableData: [],     //表格数据
      tableColumns: [],   //表格属性列
      chartDatas: chartDatas,
      widgets: [], // 保存小组件的数组
      selectedComponentType: '', // 保存当前选中的组件类型
      componentTypes: [ // 定义组件类型
        { label: '任务1：新闻类别筛选', value: '1' },
        { label: '任务2：新闻价值评价', value: '2' },
        { label: '任务3：新闻摘要生成', value: '3' },
        { label: '任务4：新闻兴趣推荐', value: '4' },
      ],
      widgetIdCounter: 0, // 小组件 ID 计数器
      newsCountText: '', // 新闻数量文本框显示的内容
      showNewsCount: false, // 控制是否显示新闻数量文本框
    };
  },
  computed: {
    selectedImageSource() {
      if(this.selectedImage==='model-lr'){
        return this.png_lr;
      }else if(this.selectedImage==='model-nb'){
        return this.png_nb;
      }else if(this.selectedImage==='model-sgd'){
        return this.png_sgd;
      }
    }
  },
  methods: {
    changeImage() {
      // 在这里可以根据需要执行更多操作
      console.log('选中的图片:', this.selectedImage);
    },
    addWidget() {
      const newWidget = {
        id: this.widgetIdCounter++, // 为小部件生成唯一 ID
        type: this.selectedComponentType,
        settings: {},
        sql:''      //保存拼装的SQL语句
      };

      //根据不同的任务，拼装不同的SQL
      if (this.selectedComponentType === '1') {        //修改settings值，拼装对应的SQL
      } else if (this.selectedComponentType === '2') {
        newWidget.settings.width = '';
      } else if (this.selectedComponentType === '3') {
        newWidget.settings.width = '';
      } else if (this.selectedComponentType === '4') {
        newWidget.settings.width = '';
      }
      // 根据选中的组件类型，设置对应的标题
      const selectedType = this.componentTypes.find(type => type.value === this.selectedComponentType);
      if (selectedType) {
        newWidget.title = selectedType.label;
      }
      this.widgets.push(newWidget);
    },
    initChart() {
      const chart = echarts.init(document.getElementById('chart'))
      chart.setOption({
        // ECharts配置项
        xAxis: {
          type: 'category',
          data: ['sql执行时间', 'udf执行时间']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'unopted', // 第一个数据系列的名称
            type: 'bar',
            data: [120, 200] // 第一个数据系列的数据
          },
          {
            name: 'opted', // 第二个数据系列的名称
            type: 'bar',
            data: [220, 180] // 第二个数据系列的数据
          }
          // 可以继续添加更多数据系列
        ]
      })
    },
    //获取新闻数据按钮，显示所有新闻数据
    showData() {
      this.tableData = NewsData;
      this.tableColumns = Object.keys(NewsData[0]);
      this.showNewsCount = true;
      // this.newsCountText = `获取${this.tableData.length}条新闻`
      this.newsCountText = '获取200条新闻'
    },
    //执行按钮，显示执行结果
    updateChart(widget) {
      if (widget.type === '1') {
        const categorySQL = `SELECT source, content, predict is_military(content) as category, probability FROM news WHERE PREDICT is_military(content) = "${widget.settings.value}";`;
        widget.sql = categorySQL;
        this.tableData = task1Data;
        this.tableColumns = Object.keys(task1Data[0]);
        //this.newsCountText = `筛选得到${this.tableData.length}条新闻`
        this.newsCountText = `获取50条新闻`
        this.showedComponentType='1';
      } else if (widget.type === '2') {
      // 根据其他组件类型继续拼装对应的 SQL 语句
        const concatenatedValues = widget.settings.models.join('(content) + PREDICT ');
        const categorySQL = `SELECT content FROM news WHERE PREDICT ${concatenatedValues}(content) >= ${widget.settings.value*widget.settings.models.length};`;
        widget.sql = categorySQL;
        this.tableData = task2Data;
        this.tableColumns = Object.keys(task2Data[0]);
        //this.newsCountText = `查询得到${this.tableData.length}条新闻`
        this.newsCountText = `获取7条新闻`
        this.showedComponentType='2';
      } else if (widget.type === '3') {
        const categorySQL = `SELECT source,content,PREDICT summary(text) AS summary FROM military_news;`;
        widget.sql = categorySQL;
        this.tableData = task3Data;
        this.tableColumns = Object.keys(task3Data[0]);
        //this.newsCountText = `查询得到${this.tableData.length}条新闻`
        this.newsCountText = `获取7条新闻`
        this.showedComponentType='3';
      } else if (widget.type === '4') {
      // 根据其他组件类型继续拼装对应的 SQL 语句
        const categorySQL = `select PREDICT summary(content) AS summary, content from news where predict sgd(text)>=${widget.settings.value} order by predict news_similar('${widget.settings.text}',content) DESC limit ${widget.settings.num};`;
        widget.sql = categorySQL;
        this.tableData = task4Data;
        this.tableColumns = Object.keys(task4Data[0]);
        //this.newsCountText = `查询得到${this.tableData.length}条新闻`
        this.newsCountText = `获取5条新闻`
        this.showedComponentType='4';
      }
    },
    // 其他方法...
  }
};
</script>

<style scoped>

.pic-container {
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-image, .right-image {
  width: 500px;
  height: auto;
}

.container {
  width: 100%; /* 设置容器宽度为100% */
  max-height: 100vh;
  margin: 0 auto; /* 居中显示 */
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 水平排列并均匀分布 */
  align-items: stretch; /* 垂直方向拉伸 */
}

.left-aside {
  background-color: #f0f2f5;
  padding: 20px;
}

.add-button {
  margin-top: 20px;
}

.execute-button-div{
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.execute-button {
  padding: 20px;
}

.collapse-container{
  margin-top: 20px;
}

.collapse-item{
  padding: 5px;
}

.collapse-el-item{
  padding: 10px;
}

.right-main {
  padding: 20px;
}

.table-main {
  height: calc(100% - 200px);
  overflow-y: auto;
}

.el-table {
  border: 1px solid #e0e0e0; /* 添加表格的边框样式 */
}

.news-count-input {
  width: 200px; /* 修改输入框的宽度 */
  font-weight: bold; /* 加粗文字 */
  color: #333; /* 修改文字颜色 */
  font-size: 18px;
}

.chart-footer {
  height: 300px;
}

.chart-box {
  margin-bottom: 20px;
  width: 100%; /* 确保图表容器有宽度 */
  height: 100%; /* 设置图表容器的高度 */
}
</style>
