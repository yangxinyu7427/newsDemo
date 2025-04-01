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
                <el-select v-model="classification">
                  <el-option label="军事" value="军事"></el-option>
                  <el-option label="非军事" value="非军事"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="widget.type === '1'" label="开启数据传输优化">
                <el-checkbox v-model="case1_opted1"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '1'" label="开启批次大小的自适应调整">
                <el-checkbox v-model="case1_opted2"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '1'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '1'">
                <el-input type="textarea" :rows="5" :value="sql1"></el-input>
                <!-- <CodeEditor
                      :lines="10"
                      :lang="'sql'"
                      :readonly="true"
                      fontsize="13"
                      ref="sql_text1"
                /> -->
              </el-form-item>
              <!-- 任务2 -->
              <el-form-item v-if="widget.type === '2'" label="模型选择（多选）">
                <el-select v-model="models" multiple>
                  <el-option label="线性回归" value="news_lr"></el-option>
                  <el-option label="随机梯度下降" value="news_sgd"></el-option>
                  <el-option label="朴素贝叶斯" value="news_nb"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item v-if="widget.type === '2'" label="选择价值范围">
                <el-select v-model="value_metric">
                  <el-option label="低" value="1"></el-option>
                  <el-option label="中" value="3"></el-option>
                  <el-option label="高" value="5"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item v-if="widget.type === '2'" label="开启查询内冗余消除">
                <el-checkbox v-model="case2_opted"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '2'">
                <el-input type="textarea" :rows="5" :value="sql2"></el-input>
              </el-form-item>
              <!-- 任务3 -->
              <!-- <el-form-item v-if="widget.type === '3'" label="选择模型加速策略">
                <el-select v-model="widget.settings.value">
                  <el-option label="剪枝" value="1"></el-option>
                  <el-option label="量化" value="2"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item v-if="widget.type === '3'" label="开启模型调用上下文复用">
                <el-checkbox v-model="case3_opted"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '3'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '3'">
                <el-input type="textarea" :rows="5" :value="sql3"></el-input>
              </el-form-item>
              <!-- 任务4 -->
              <el-form-item v-if="widget.type === '4'" label="新闻选择">     
                <el-input v-model="news_text"></el-input>
              </el-form-item>
              <!-- <el-form-item v-if="widget.type === '4'" label="选择价值范围">
                <el-select v-model="value_metric">
                  <el-option label="低" value="1"></el-option>
                  <el-option label="中" value="3"></el-option>
                  <el-option label="高" value="5"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item v-if="widget.type === '4'" label="返回新闻条数">
                <el-input v-model="sql_num"></el-input>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="开启查询间冗余消除">
                <el-checkbox v-model="case4_opted"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '4'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '4'">
                <el-input type="textarea" :rows="10" :value="sql4"></el-input>
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
          <!-- <el-footer v-if="showNewsCount" class="result-footer">
            <el-input v-model="newsCountText" :disabled="true" class="news-count-input"></el-input>
          </el-footer> -->
          <el-main class="table-main">
            <div v-if = "showTabel">
              <el-table :data="paginatedData" border stripe max-height="400"> 
                <el-table-column v-for="(value, key) in tableColumns" :key="key" :prop="value" :label="value" :width="ColumnWidth[value]">
                  <template v-slot="scope">
                    <div v-if="value === '内容'" class="content-cell">
                      <div class="content-text">{{ scope.row[value] }}</div>
                    </div>
                    <div v-else>{{ scope.row[value] }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalRecords">
              </el-pagination>
            </div>
          </el-main>
          <el-header style="height: 50px;">优化效果</el-header>
          <el-footer class="chart-footer">
            <!-- 执行时间图 -->
            <div class="pic-container" v-if="showedComponentType === '1'" style="display: flex; justify-content: center; align-items: center;">
              <div id="chart1" style="width: 1000px; height: 400px;"></div>
            </div>
            <div class="pic-container" v-if="showedComponentType === '2'" style="display: flex; justify-content: center; align-items: center;">
              <div id="chart2" style="width: 400px; height: 400px;"></div>
            </div>
            <div class="pic-container" v-if="showedComponentType === '3'" style="display: flex; justify-content: center; align-items: center;">
              <div id="chart3" style="width: 400px; height: 400px;"></div>
            </div>
            <div class="pic-container" v-if="showedComponentType === '4'" style="display: flex; justify-content: center; align-items: center;">
              <div id="chart4" style="width: 400px; height: 400px;"></div>
            </div>
            <!-- udf_batch图 -->
            <div class="pic-container" v-if="showedComponentType === '1'" style="display: flex; justify-content: center; align-items: center;">
              <el-card id="batch-time" header="批次大小自适应调整吞吐量（优化前后）">
                <div id="batch_time_chart" style="width: 400px; height: 400px;"></div>
              </el-card>
            </div>
            <div v-if="showedComponentType === '3'">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-card id="plan" header="Python UDF(优化前)">
                    <CodeEditor
                      :lines="20"
                      :lang="'python'"
                      :readonly="true"
                      fontsize="13"
                      ref="udf_plan_n"
                    />
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card id="plan" header="Python UDF(优化后)">
                    <CodeEditor
                      :lines="20"
                      :lang="'python'"
                      :readonly="true"
                      fontsize="13"
                      ref="udf_plan_o"
                    />
                  </el-card>
                </el-col>
              </el-row>
            </div>  
            <div v-if="showedComponentType === '2'">
              <el-card id="plan" header="计划树:">
                <PlanTree content="sql_plan" ref="tree"/>
              </el-card>
            </div>
            <div class="pic-container" v-if="showedComponentType === '4'" style="display: flex; justify-content: center; align-items: center;">
              <div id="cache-hit-rate-chart" style="width: 400px; height: 400px;"></div>
            </div>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>

import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts'
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import PlanTree from './components/PlanTree.vue';
import CodeEditor from "./components/CodeEditor.vue";

const count = ref(0);
const showedComponentType = ref(''); 
const newsCountText = ref('');   //可以删除
const selectedImage = ref('model-lr');
const widgets = ref([]);
const selectedComponentType = ref('');
const componentTypes = ref([
      { label: '任务1：新闻类别筛选', value: '1' },
      { label: '任务2：获取高价值新闻', value: '2' },
      { label: '任务3：新闻摘要生成', value: '3' },
      { label: '任务4：相关新闻检索', value: '4' },
    ]);
const widgetIdCounter = ref(0);
// const showNewsCount = ref(false);
const showTabel = ref(false);
const result = ref(null);
const tableData = ref([]);
const paginatedData = ref([]);   //分页数据
const tableColumns = ref([]);
const ColumnWidth = ref({"编号":100,"标题":300,"链接":200,"来源":150,"内容":600});    
const totalRecords = ref(0);   //查询总记录数
const currentPage = ref(1);    //当前所在页
const pageSize = ref(10);      //每页记录数
const sql = ref(null);          //获取新闻数据sql语句
const sql1 = ref(null);         //case1 sql语句 
const sql2 = ref(null);         //case2 sql语句 
const sql3 = ref(null);         //case3 sql语句
const sql4 = ref(null);         //case1 sql语句 
 
const opt_udf_batch_time = ref([]);
const naive_udf_batch_time = ref([]);
const classification = ref(null);
const models = ref([]);
//高价值新闻 标准>= 4
const value_metric = ref(4);
const news_text = ref(null);
const sql_num = ref(0);

const udf_plan_n = ref();
const udf_plan_o = ref();

const sql_text1 = ref();

const chart1 = ref(null);
const chart2 = ref(null);
const chart3 = ref(null);
const chart4 = ref(null);

const case1_opted1 = ref(false);       //数据传输优化
const case1_opted2 = ref(false);       //批次大小的自适应调整
const case2_opted = ref(false);
const case3_opted = ref(false);
const case4_opted = ref(false);
const naive_execution_time1 = ref(0);
const opt_execution_time1 = ref(0);
const naive_udf_time1 = ref(0);
const opt_udf_time1 = ref(0);
const unopt1_execution_time = ref(0);
const unopt2_execution_time = ref(0);
const unopt1_udf_time = ref(0);
const unopt2_udf_time = ref(0);

const naive_execution_time2 = ref(0);
const opt_execution_time2 = ref(0);
const naive_udf_time2 = ref(0);
const opt_udf_time2 = ref(0);
const naive_execution_time3 = ref(0);
const opt_execution_time3 = ref(0);
const naive_udf_time3 = ref(0);
const opt_udf_time3 = ref(0);
const naive_execution_time4 = ref(0);
const opt_execution_time4 = ref(0);
const naive_udf_time4 = ref(0);
const opt_udf_time4 = ref(0);

const url = ref(null);
const url1 = ref(null);

const showOptedModel = ref(false);
// const selectedImageSource = ref('');
// const previewSrcList = ref([]);
// const srcList1 = ref([png_lr, png_nb, png_sgd]);
// const srcList2 = ref([png_opted]);

const tree = ref();
const showPic = ref(false);
const naive_tree = ref();
const opt_tree = ref();

const tree_data = ref(null);
const naive_tree_data = ref(null);
const opt_tree_data = ref(null);

const code = ref('');
const rewrite_code = ref('');

const cache_hit_rate = ref(0);
const udf_batch_all = ref(0);
const udf_batch_real = ref(0);
const udf_hit = ref(0)


const changeImage = () => {
  console.log('选中的图片:', selectedImage.value);
};

const addWidget = () => {
  const newWidget = {
    id: widgetIdCounter.value++,
    type: selectedComponentType.value,
    settings: {},
  };
  // 根据选中的组件类型，设置对应的标题
  const selectedType = componentTypes.value.find(type => type.value === selectedComponentType.value);
  if (selectedType) {
    newWidget.title = selectedType.label;
  }
  widgets.value.push(newWidget);
};

const initChart = (caseType) => {
  nextTick(() => {
    const barchartDom1 = document.getElementById('chart1');
    if (barchartDom1) {
      chart1.value = echarts.init(barchartDom1);
      let seriesData = ref([]);
      seriesData.value = [
        {
          name: '开启数据传输优化',
          type: 'bar',
          data: [unopt2_execution_time.value, unopt2_udf_time.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '开启批次大小的自适应调整',
          type: 'bar',
          data: [unopt1_execution_time.value, unopt1_udf_time.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化全部开启',
          type: 'bar',
          data: [opt_execution_time1.value, opt_udf_time1.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart1.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间', 'udf执行时间']
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData.value,
        legend: {
          data: ['开启数据传输优化','开启批次大小的自适应调整','开启全部优化'],    
        }
      });
    }
    else {
      console.error('Chart1 DOM element not found');
    }

    const barchartDom2 = document.getElementById('chart2');
    if (barchartDom2) {
      chart2.value = echarts.init(barchartDom2);
      let seriesData = ref([]);
      let legendData = ref([]);
      legendData.value = ['优化前', '优化后'];
      seriesData.value = [
        {
          name: '优化前',
          type: 'bar',
          data: [naive_execution_time2.value, naive_udf_time2.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化后',
          type: 'bar',
          data: [opt_execution_time2.value, opt_udf_time2.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart2.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间', 'udf执行时间']
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData.value,
        legend: {
          data: legendData.value,
        }
      });
    }
    else {
      console.error('Chart1 DOM element not found');
    }

    const barchartDom3 = document.getElementById('chart3');
    if (barchartDom3) {
      chart3.value = echarts.init(barchartDom3);
      let seriesData = ref([]);
      let legendData = ref([]);
      legendData.value = ['优化前', '优化后'];
      seriesData.value = [
        {
          name: '优化前',
          type: 'bar',
          data: [naive_execution_time3.value, naive_udf_time3.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化后',
          type: 'bar',
          data: [opt_execution_time3.value, opt_udf_time3.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart3.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间', 'udf执行时间']
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData.value,
        legend: {
          data: legendData.value,
        }
      });
    }
    else {
      console.error('Chart3 DOM element not found');
    }

    const barchartDom4 = document.getElementById('chart4');
    if (barchartDom4) {
      chart4.value = echarts.init(barchartDom4);
      let seriesData = ref([]);
      let legendData = ref([]);
      legendData.value = ['优化前', '优化后'];
      seriesData.value = [
        {
          name: '优化前',
          type: 'bar',
          data: [naive_execution_time4.value, naive_udf_time4.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化后',
          type: 'bar',
          data: [opt_execution_time4.value, opt_udf_time4.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart4.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间', 'udf执行时间']
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData.value,
        legend: {
          data: legendData.value,
        }
      });
    }
    else {
      console.error('Chart4 DOM element not found');
    }

    const lineChartDom = document.getElementById('batch_time_chart');
    if (lineChartDom) {
      const chart = echarts.init(lineChartDom);
  
      const seriesDataOpted = opt_udf_batch_time.value.map((time, index) => ({
        name: `Batch ${index + 1}`,
        value: time,
      }));
  
      const seriesDataNaive = naive_udf_batch_time.value.map((time, index) => ({
        name: `Batch ${index + 1}`,
        value: time,
      }));
      // 设置 x 轴数据，显示批次标签
      const xAxisData = Array.from({ length: Math.max(opt_udf_batch_time.value.length, naive_udf_batch_time.value.length) }, (_, i) => `Batch ${i + 1}`);

      chart.setOption({
        // title: {
        //   text: 'UDF Batch/Time Comparison',
        // },
        tooltip: {
        trigger: 'axis',
        },
        legend: {
          data: ['优化后', '优化前'],
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          name: '批次',
          axisLabel: {
            interval: 0, // 强制显示所有 x 轴标签
            rotate: 45, // 旋转标签，避免重叠
          }
        },
        yAxis: {
          type: 'value',
          name: '吞吐量 (row/s)',
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: (10 / xAxisData.length) * 100, // 只显示前10个批次
            handleSize: '100%',
          },
        ],
        series: [
          {
            name: '优化后',
            type: 'line',
            data: seriesDataOpted.map(item => item.value),
          },
          {
            name: '优化前',
            type: 'line',
            data: seriesDataNaive.map(item => item.value),
          },
        ],
      });
    } else {
      console.error('line DOM element not found');
   }
    const pieChartDom = document.getElementById('cache-hit-rate-chart');
    if (pieChartDom) {
      const pieChart = echarts.init(pieChartDom);
      pieChart.setOption({
        title: {
          // text: '缓存命中率:${udf_hit.value}/${udf_batch_all.value}',
          text: '缓存命中率:',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '缓存命中率',
            type: 'pie',
            radius: '50%',
            center: ['50%','50%'],   //饼图居中显示
            data: [
              { value: cache_hit_rate.value, name: '命中' },
              { value: 100 - cache_hit_rate.value, name: '未命中' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'
            },
            labelLine: {
              show: true
            }
          }
        ]
      });
    } else {
      console.error('Pie chart DOM element not found');
    }
  });
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  //数据分页
  paginateData();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  //数据分页
  paginateData();
};

//设置分页数据
const paginateData = () => {
  showTabel.value = true;
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  paginatedData.value = tableData.value.slice(start, end);
};

// 点击获取新闻数据按钮，显示所有新闻数据
const showData = async () => {
  sql.value = `select id,link,source,text from news limit 2000;`    //SQL语句
  const encodedSql = encodeURIComponent(sql.value);
  url.value = `http://49.52.27.23:8000/opted/task1?sql=${encodedSql}`;
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["编号","链接","来源","内容"];
    tableData.value = result.value.ans.map(row => {
      return {
        "编号": row[0],
        "链接": row[1],
        "来源": row[2],
        "内容": row[3],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    paginateData();  
  }
  // showNewsCount.value = true;
  // newsCountText.value = `获取${tableData.value.length}条新闻`
  // newsCountText.value = '获取200条新闻';
};

// 展示case1查询结果及优化效果
const showCase1 = async () => {
  showedComponentType.value = '1';
  sql1.value = `SELECT id, link, source, text, predict is_military(text) as category FROM news WHERE predict is_military(text) = "${classification.value}";`;
  const encodedSql = encodeURIComponent(sql1.value);
  // 组装url
  if (case1_opted2.value && case1_opted1.value) {
    url.value = `http://49.52.27.23:8000/opted/task1?sql=${encodedSql}`;
  } else if (case1_opted1.value === false && case1_opted2.value === true) {     //未开启数据传输优化
    url.value = `http://49.52.27.23:8000/unopted1/task1?sql=${encodedSql}`;
  } else if (case1_opted1.value === true && case1_opted2.value === false) {     //未开启开启批次大小的自适应调整
    url.value = `http://49.52.27.23:8000/unopted2/task1?sql=${encodedSql}`;
  }
  console.log(url.value);
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["编号","链接","来源","内容","类别"];
    tableData.value = result.value.ans.map(row => {
      return {
        "编号": row[0],
        "链接": row[1],
        "来源": row[2],
        "内容": row[3],
        "类别": row[4],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    //是否开启优化
    if (case1_opted2.value && case1_opted1.value) {          // 两个优化均开启
      opt_execution_time1.value = result.value.execution_time;     //总执行时间
      opt_udf_time1.value = result.value.udf_time / 1000;                //udf执行时间
      opt_udf_batch_time.value = result.value.udf_batch_time ;    //获取批次/时间s
    } else if (case1_opted1.value === false && case1_opted2.value === true){   //未开启数据传输优化
      unopt1_execution_time.value = result.value.execution_time;
      unopt1_udf_time.value = result.value.udf_time / 1000;
    } else if (case1_opted1.value === true && case1_opted2.value === false){   //未开启批次大小自适应调整
      unopt2_execution_time.value = result.value.execution_time;
      unopt2_udf_time.value = result.value.udf_time / 1000;
      naive_udf_batch_time.value = result.value.udf_batch_time;    //获取批次/时间s
    } 
    //console.log(opt_execution_time.value);
    paginateData();
    //获取数据后再初始化图表
    initChart('1');
  }
};

// 展示case2查询结果及优化效果
const showCase2 = async () => {
  showedComponentType.value = '2';
  const concatenatedValues = models.value.join('(text) + predict ');
  sql2.value = `SELECT id,link,source,text FROM military_news WHERE predict ${concatenatedValues}(text) >= ${value_metric.value * models.value.length};`;
  const encodedSql = encodeURIComponent(sql2.value);
  // 组装url
  //写一个if逻辑根据是否开启优化传入不同的url
  if (case2_opted.value) {
    url.value = `http://49.52.27.23:8000/opted/task2?sql=${encodedSql}`;
  } else {
    url.value = `http://49.52.27.23:8000/unopted/task2?sql=${encodedSql}`;
  }
  console.log(url.value);
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["编号","链接","来源","内容"];
    tableData.value = result.value.ans.map(row => {
      return {
        "编号": row[0],
        "链接": row[1],
        "来源": row[2],
        "内容": row[3],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    if (case2_opted.value) {     //是否开启优化
      opt_execution_time2.value = result.value.execution_time;     //总执行时间
      opt_udf_time2.value = result.value.udf_time / 1000;
    } else {
      naive_execution_time2.value = result.value.execution_time;
      naive_udf_time2.value = result.value.udf_time / 1000;
    }
    // console.log(opt_execution_time.value);
    // console.log(naive_execution_time.value);
    paginateData();
    initChart('2');  
  }
  // //发送给case4后端，作为缓存
  // url1.value = `http://49.52.27.23:8000/opted/task4?sql=${encodedSql}`;
  // await getResult(url1.value);
  // console.log(url1.value);
  //绘制优化图
  reRender();
};

const send2to4 = async () => {
  showedComponentType.value = '2';
  const concatenatedValues = models.value.join('(text) + predict ');
  sql2.value = `SELECT id,link,source,text FROM military_news WHERE predict ${concatenatedValues}(text) >= ${value_metric.value * models.value.length};`;
  const encodedSql = encodeURIComponent(sql2.value);
  url1.value = `http://49.52.27.23:8000/opted/task4?sql=${encodedSql}`;
  await getResult(url1);
  if (result.value && result.value.ans) {
    console.log('get result')
  }
}

// 展示case3查询结果及优化效果
const showCase3 = async () => {
  showedComponentType.value = '3';
  if (case3_opted.value) {
    sql3.value = `SELECT id,source,text,predict summary_opt(text) AS summary FROM important_news order by id ASC;`;
  } else {
    sql3.value = `SELECT id,source,text,predict summary(text) AS summary FROM important_news order by id ASC;`;
  }
  const encodedSql = encodeURIComponent(sql3.value);
  // 组装url
  url.value = `http://49.52.27.23:8000/opted/task3?sql=${encodedSql}`;
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["编号","来源","内容","摘要"];
    tableData.value = result.value.ans.map(row => {
      return {
        "编号": row[0],
        "来源": row[1],
        "内容": row[2],
        "摘要": row[3],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    if (case3_opted.value) {     //是否开启优化
      opt_execution_time3.value = result.value.execution_time;     //总执行时间
      opt_udf_time3.value = result.value.udf_time / 1000;
    } else {
      naive_execution_time3.value = result.value.execution_time;
      naive_udf_time3.value = result.value.udf_time / 1000;
    }
    paginateData();  
  }
  //绘制优化图
  reRender();
  initChart('3');
};

// 展示case4查询结果及优化效果
const showCase4 = async () => {
  showedComponentType.value = '4';
  sql4.value = `select source,text,predict similar_w2v("${news_text.value}",text) AS similar from history_news where predict news_lr(text)>=3 order by similar DESC limit ${sql_num.value};`;
  const encodedSql = encodeURIComponent(sql4.value);
  // 组装url
  //写一个if逻辑根据是否开启优化传入不同的url
  if (case4_opted.value) {
    url.value = `http://49.52.27.23:8000/opted/task4?sql=${encodedSql}`;
  } else {
    url.value = `http://49.52.27.23:8000/opted/task1?sql=${encodedSql}`;
  }
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["来源","内容","相似度"];
    tableData.value = result.value.ans.map(row => {
      return {
        "来源": row[0],
        "内容": row[1],
        "相似度": row[2],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    if (case4_opted.value) {     //是否开启优化
      opt_execution_time4.value = result.value.execution_time ;     //总执行时间
      opt_udf_time4.value = result.value.udf_time / 1000;
    } else {
      naive_execution_time4.value = result.value.execution_time;
      naive_udf_time4.value = result.value.udf_time / 1000;
    }
    udf_batch_all.value = result.value.udf_batch_all;
    udf_batch_real.value = result.value.udf_batch_real;
    udf_hit.value = udf_batch_all.value - udf_batch_real.value;
    cache_hit_rate.value = udf_hit.value / udf_batch_all.value * 100;
    console.log(udf_batch_all.value)
    console.log(udf_batch_real.value)
    console.log(cache_hit_rate.value)
    paginateData();  
  }
  initChart('4');
};

// 执行按钮，显示执行结果
const updateChart = (widget) => {
  if (widget.type === '1') {
    showCase1();
  } else if (widget.type === '2') {
    showCase2();
    send2to4();
  } else if (widget.type === '3') {
    showCase3();
  } else if (widget.type === '4') {
    showCase4();
  }
};

// 通过后端连接数据库，获取查询结果
const getResult = async(url) => {
  try {
    // 发送 HTTP GET 请求
    const response = await fetch(url.value);
    console.log(response);
    // 检查响应状态
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    // 解析 JSON 响应
    const data = await response.json();
    result.value = data;
    // 处理结果
    } catch (error) {
      console.error('Fetch error: ', error);
    }
};

const reRender = async() => {
  //等待下一次DOM更新周期
  await nextTick();
  //sql 显示
  // console.log(sql_text1.value);
  // sql_text1.value.setVal(sql1.value);
  //case2 优化图
  if (showedComponentType.value === '2') {
    tree.value.Draw(tree_data.value,"plan");
    //showPic.value = true;
    // naive_tree.value.Draw(naive_tree_data.value,"expr");
    // opt_tree.value.Draw(opt_tree_data.value,"expr");
  }
  //case3 Python Code
  if (showedComponentType.value === '3') {
    if (case3_opted.value) {
      if (udf_plan_o.value) {
        udf_plan_o.value.setVal(rewrite_code.value);
      }
    } else {
      if (udf_plan_n.value) {
        udf_plan_n.value.setVal(code.value);
      }
    }
  }
};

// const nodeClickedHandler = ((label) => {
//   // 处理节点点击事件
//   console.log("节点点击事件:", label);
//   if (label === 'model_merged') {
//     showOptedModel.value = true;
//   }
// });

onMounted(() => {
  //获取数据
  import('./data/data.js').then((module) => {
    tree_data.value = module.opt_plan;
    // naive_tree_data.value = module.naive_expression;
    // opt_tree_data.value = module.opt_expression;
    code.value = module.function_code.code;
    rewrite_code.value = module.function_code.rewrite_code;
    }).catch((error) => {
      console.error('Failed to load data:', error);
    });
});

</script>

<style scoped>

.pic-container {
  margin-top: 10px;
  margin-bottom: 20px;   /*  设置间距  */
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

.content-cell {
  max-height: 200px; /* 设置单元格最大高度 */
  overflow: hidden;
  position: relative;
}

.content-text {
  max-height: 200px; /* 设置文本最大高度 */
  overflow-y: auto;
  padding-right: 10px; /* 为滚动条预留空间 */
}

.content-cell::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 100%;
  background: linear-gradient(to right, transparent, white);
}

.code-card {
  font-family: 'Courier New', Courier, monospace;
  background-color: #f5f5f5;
}
pre {
  margin: 0;
  padding: 10px;
  white-space: pre-wrap; /* Wrap lines */
  word-break: break-all; /* Break long words */
}

.news-count-input {
  width: 200px; /* 修改输入框的宽度 */
  font-weight: bold; /* 加粗文字 */
  color: #333; /* 修改文字颜色 */
  font-size: 18px;
}

.chart-footer {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.chart-box {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%; /* 确保图表容器有宽度 */
}

.el-card {
  margin-top: 20px;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: 100px;
  height: 100px;
  margin: 5px;
}

</style>
