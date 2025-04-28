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
          <el-collapse-item v-for="(widget, ) in widgets" :key="widget.id" :title="widget.title"
                            class="collapse-item">
            <el-form label-position="left" class="collapse-el-item">
              <!-- 任务1 -->
              <el-form-item v-if="widget.type === '1'" label="开启优化">
                <el-checkbox v-model="case1_opted"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '1'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '1'">
                <el-input type="textarea" :rows="5" :value="sql1"></el-input>
              </el-form-item>
              <!-- 任务2 -->
              <el-form-item v-if="widget.type === '2'" label="开启优化">
                <el-checkbox v-model="case2_opted"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '2'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '2'">
                <el-input type="textarea" :rows="5" :value="sql2"></el-input>
              </el-form-item>
              <!-- 任务3 -->
              <el-form-item v-if="widget.type === '3'" label="开启优化">
                <el-checkbox v-model="case3_opted"></el-checkbox>
              </el-form-item>
              <el-form-item v-if="widget.type === '3'" label="SQL语句：">
              </el-form-item>
              <el-form-item v-if="widget.type === '3'">
                <el-input type="textarea" :rows="5" :value="sql3"></el-input>
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
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>

import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts'

const count = ref(0);
const showedComponentType = ref(''); 
const newsCountText = ref('');   //可以删除
const selectedImage = ref('model-lr');
const widgets = ref([]);
const selectedComponentType = ref('');
const componentTypes = ref([
      { label: '任务1：地外物体威胁评估', value: '1' },
      { label: '任务2：航空器电池寿命预测', value: '2' },
      { label: '任务3：航空器发动机寿命预测', value: '3' },
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

const case1_opted = ref(false);       //数据传输优化
const case1_opted2 = ref(false);       //批次大小的自适应调整
const case2_opted = ref(false);
const case3_opted = ref(false);
const case4_opted = ref(false);
const naive_execution_time1 = ref(0);
const opt_execution_time1 = ref(0);
const unopt_execution_time1 = ref(0);
const naive_udf_time1 = ref(0);
const opt_udf_time1 = ref(0);
const unopt1_execution_time = ref(0);
const unopt2_execution_time = ref(0);
const unopt1_udf_time = ref(0);
const unopt2_udf_time = ref(0);

const naive_execution_time2 = ref(0);
const opt_execution_time2 = ref(0);
const unopt_execution_time2 = ref(0);
const naive_udf_time2 = ref(0);
const opt_udf_time2 = ref(0);
const naive_execution_time3 = ref(0);
const opt_execution_time3 = ref(0);
const unopt_execution_time3 = ref(0);
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
      let legendData = ref([]);
      legendData.value = ['优化前', '优化后'];
      seriesData.value = [
        {
          name: '优化前',
          type: 'bar',
          data: [unopt_execution_time1.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化后',
          type: 'bar',
          data: [opt_execution_time1.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart1.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间']
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
          data: [unopt_execution_time2.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化后',
          type: 'bar',
          data: [opt_execution_time2.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart2.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间']
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
          data: [unopt_execution_time3.value],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '优化后',
          type: 'bar',
          data: [opt_execution_time3.value],
          label: {
            show: true,
            position: 'top'
          }
        }
      ];
      chart3.value.setOption({
        xAxis: {
          type: 'category',
          data: ['sql执行时间']
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


// 展示case1查询结果及优化效果
const showCase1 = async () => {
  showedComponentType.value = '1';
  sql1.value = `SELECT * from nasa_50w where PREDICT USING Model nasa_rf_model(est_diameter_min, est_diameter_max, relative_velocity, miss_distance, absolute_magnitude) = 0;`;
  const encodedSql = encodeURIComponent(sql1.value);
  // 组装url
  if (case1_opted.value) {
    url.value = `http://172.23.166.102:8000/opted/task1?sql=${encodedSql}`;
  } else {
    url.value = `http://172.23.166.102:8000/unopted/task1?sql=${encodedSql}`;
  }
  console.log(url.value);
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["id","est_diameter_min","est_diameter_max","relative_velocity","miss_distance","absolute_magnitude"];
    tableData.value = result.value.ans.map(row => {
      return {
        "id": row[0],
        "est_diameter_min": row[1],
        "est_diameter_max": row[2],
        "relative_velocity": row[3],
        "miss_distance": row[4],
        "absolute_magnitude": row[5],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    //是否开启优化
    if (case1_opted.value) {          // 优化开启
      opt_execution_time1.value = result.value.execution_time;     //总执行时间
    } else {   //未开启批次大小自适应调整
      unopt_execution_time1.value = result.value.execution_time;
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
    url.value = `http://172.23.166.102:8000/opted/task2?sql=${encodedSql}`;
  } else {
    url.value = `http://172.23.166.102:8000/unopted/task2?sql=${encodedSql}`;
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
    } else {
      unopt_execution_time2.value = result.value.execution_time;
    }
    // console.log(opt_execution_time.value);
    // console.log(naive_execution_time.value);
    paginateData();
    initChart('2');  
  }
};


// 展示case3查询结果及优化效果
const showCase3 = async () => {
  showedComponentType.value = '3';
  sql3.value = `SELECT ID, PREDICT USING Model cmapss_rf_model(unit_number, time_cycles, setting_1, setting_2, setting_3, s_1, s_2 , s_3 , s_4 , s_5 , s_6 , s_7 , s_8 , s_9 , s_10 , s_11 , s_12 , s_13 , s_14 , s_15 , s_16 , s_17 , s_18 , s_19 , s_20 , s_21) as rul from cmapss where unit_number=1;`;
  const encodedSql = encodeURIComponent(sql3.value);
  if (case3_opted.value) {
    url.value = `http://172.23.166.102:8000/opted/task3?sql=${encodedSql}`;
  } else {
    url.value = `http://172.23.166.102:8000/unopted/task3?sql=${encodedSql}`;
  }
  await getResult(url);
  if (result.value && result.value.ans) {
    tableColumns.value = ["id","rul"];
    tableData.value = result.value.ans.map(row => {
      return {
        "id": row[0],
        "rul": row[1],
      };
    });
    // tableColumns.value = Object.keys(result.ans[0]);
    totalRecords.value = result.value.ans.length;   //后端返回总记录数
    if (case3_opted.value) {     //是否开启优化
      opt_execution_time3.value = result.value.execution_time;     //总执行时间
    } else {
      unopt_execution_time3.value = result.value.execution_time;
    }
    paginateData();  
  }
  initChart('3');
};


// 执行按钮，显示执行结果
const updateChart = (widget) => {
  if (widget.type === '1') {
    showCase1();
  } else if (widget.type === '2') {
    showCase2();
  } else if (widget.type === '3') {
    showCase3();
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
