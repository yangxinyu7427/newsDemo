export default {
  mounted() {
    this.initChart()
  },
  data() {
    return {
      srcList1: [            
          png_lr,
          png_nb,
          png_sgd
          ],
      srcList2: [
        png_opted
      ],
      count: 0,
      showedComponentType:'',
      png_opted:png_opted,
      png_lr:png_lr,
      png_nb:png_nb,
      png_sgd:png_sgd,
      png_rewrite:png_rewrite,  //模型加载自动外提技术展示
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
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
    },
    load() {
      this.count += 2;
    }
    // 其他方法...
  }
};