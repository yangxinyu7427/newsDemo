// data.js

export const tableData = [
    { news: 'New York' },
    { news: 'Los Angeles' },
    { news: 'Chicago' },
    { news: 'Chicago' },
    { news: 'Chicago' },
    { news: 'Chicago' },
    { news: 'Chicago' },
    { news: 'Chicago' }
];

export const chartDatas= [
    {
        // 图表的标题
        title: {
            text: '柱状图示例1'
        },
        // 图表的提示框组件
        tooltip: {
            trigger: 'axis'
        },
        // 图表的 x 轴配置
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        // 图表的 y 轴配置
        yAxis: {
            type: 'value'
        },
        // 图表的系列配置，这里是柱状图
        series: [
            {
                name: '销量',
                type: 'bar',
                data: [120, 200, 150, 80, 70, 110, 130]
            }
        ]
    },
    {
        // 图表的标题
        title: {
            text: '柱状图示例2'
        },
        // 图表的提示框组件
        tooltip: {
            trigger: 'axis'
        },
        // 图表的 x 轴配置
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        // 图表的 y 轴配置
        yAxis: {
            type: 'value'
        },
        // 图表的系列配置，这里是柱状图
        series: [
            {
                name: '销量',
                type: 'bar',
                data: [120, 200, 150, 80, 70, 110, 130]
            }
        ]
    }
    // 可以继续添加更多的图表数据
]