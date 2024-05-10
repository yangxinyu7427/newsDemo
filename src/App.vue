<template>
  <div class="container">
    <el-container>
      <!-- 左侧布局 -->
      <el-aside class="left-aside">
        <div class="execute-button-div">
          <el-button @click="showData" class="add-button">获取新闻数据</el-button>
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
                <el-select v-model="widget.settings.value">
                  <el-option label="线性回归" value="1"></el-option>
                  <el-option label="随机梯度下降" value="2"></el-option>
                  <el-option label="朴素贝叶斯" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="选择价值范围">
                <el-select v-model="widget.settings.value">
                  <el-option label="低" value="low"></el-option>
                  <el-option label="中" value="medium"></el-option>
                  <el-option label="高" value="high"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="开启查询内冗余消除">
                <el-checkbox v-model="widget.settings.checked"></el-checkbox>
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
                  <el-option label="低" value="low"></el-option>
                  <el-option label="中" value="medium"></el-option>
                  <el-option label="高" value="high"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="返回新闻条数">
                <el-input v-model="widget.settings.text"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="开启查询间冗余消除">
                <el-checkbox v-model="widget.settings.checked"></el-checkbox>
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
          <el-main class="table-main">
            <el-table :data="tableData" border>
              <el-table-column v-for="(value, key) in tableColumns" :key="key" :prop="key" :label="key"></el-table-column>
            </el-table>
          </el-main>
          <el-header style="height: 50px;">优化效果</el-header>
          <el-footer class="chart-footer">
            <!-- 底部图表 -->
            <div class="chart-box" v-for="(chartData, index) in chartDatas" :key="index">
              <div id="chart" style="height: 400px;"></div>
            </div>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import { tableData, chartDatas,NewsData,inferenceResultsData } from './data/data.js';
import * as echarts from 'echarts'

export default {
  mounted() {
    this.initChart()
  },
  data() {
    return {
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
      widgetIdCounter: 0 // 小组件 ID 计数器
    };
  },
  methods: {
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      })
    },
    //获取新闻数据按钮，显示所有新闻数据
    showData() {
      // console.log(tableData);
      this.tableData = NewsData;
      this.tableColumns = Object.values(NewsData[0]);
      console.log(this.tableData);
      console.log(this.tableColumns);
    },
    //执行按钮，显示执行结果
    updateChart(widget) {
      if (widget.type === '1') {
        const categorySQL = `SELECT title, source, content FROM news WHERE PREDICT is_military(content) = "${widget.settings.value}";`;
        widget.sql = categorySQL;
        console.log(categorySQL);
      } else if (widget.type === '2') {
      // 根据其他组件类型继续拼装对应的 SQL 语句
      } else if (widget.type === '3') {
        const categorySQL = `SELECT PREDICT summary(text) AS summary FROM important_news;`;
        widget.sql = categorySQL;
      } else if (widget.type === '4') {
      // 根据其他组件类型继续拼装对应的 SQL 语句
      }
    }
    // 其他方法...
  }
};
</script>

<style scoped>

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

.chart-footer {
  height: 300px;
}

.chart-box {
  margin-bottom: 20px;
  width: 100%; /* 确保图表容器有宽度 */
  height: 100%; /* 设置图表容器的高度 */
}
</style>
