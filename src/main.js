import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import './style.css'
import App from './App.vue'
// //引入echarts
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'
// import * as echarts from  'echarts'
// //引入vue-echarts组件
// import ECharts from 'vue-echarts'

const app= createApp(App)
app.use(ElementPlus)
// app.component('v-chart', ECharts)
app.mount('#app')

