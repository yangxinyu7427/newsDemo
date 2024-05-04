<template>
  <div class="container">
    <el-container>
      <!-- 左侧布局 -->
      <el-aside class="left-aside">
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
          <el-collapse-item v-for="(widget, index) in widgets" :key="widget.id" :title=" '任务' + (index + 1)"
                            class="collapse-item">
            <el-form label-width="auto" class="collapse-el-item">
              <el-form-item v-if="widget.type === 'text'" label="文本内容">
                <el-input v-model="widget.settings.text"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === 'text'" label="字体大小">
                <el-input v-model="widget.settings.fontSize"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === 'image'" label="图像链接">
                <el-input v-model="widget.settings.imageUrl"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === 'image'" label="宽度">
                <el-input v-model="widget.settings.width"></el-input>
              </el-form-item>
            </el-form>
            <div class="execute-button-div">
              <el-button @click="updateChart" class="execute-button">执行</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>

      <!-- 右侧布局 -->
      <el-main class="right-main">
        <el-container direction="vertical">
          <el-header style="height: 50px;">表格</el-header>
          <el-main class="table-main">
            <el-table :data="tableData" border>
              <el-table-column prop="news" label="新闻"></el-table-column>
            </el-table>
          </el-main>
          <el-header style="height: 50px;">图表</el-header>
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

import { tableData, chartDatas } from './data/data.js';
import * as echarts from 'echarts'

export default {
  mounted() {
    this.initChart()
  },
  data() {
    return {
      tableData: tableData,
      chartDatas: chartDatas,
      widgets: [], // 保存小组件的数组
      selectedComponentType: '', // 保存当前选中的组件类型
      componentTypes: [ // 定义组件类型
        { label: '文本组件', value: 'text' },
        { label: '图像组件', value: 'image' }
      ],
      widgetIdCounter: 0 // 小组件 ID 计数器
    };
  },
  methods: {
    addWidget() {
      const newWidget = {
        id: this.widgetIdCounter++, // 为小部件生成唯一 ID
        type: this.selectedComponentType,
        settings: {}
      };
      if (this.selectedComponentType === 'text') {
        newWidget.settings.text = '';
        newWidget.settings.fontSize = '';
      } else if (this.selectedComponentType === 'image') {
        newWidget.settings.imageUrl = '';
        newWidget.settings.width = '';
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
  padding: 20px;
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
