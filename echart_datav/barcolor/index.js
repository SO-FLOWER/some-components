var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
var Echarts = require('echarts');
//var Chart = require('XXX');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    this.chart = Echarts.init(this.container[0]);
    this.chart.setOption(this.getEchartsConfig(),true)
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  getEchartsConfig(){

    if(!this._data){
      return {}
    }
    const xAxisData = [];
    const seriesData = [];
    this._data.map(item => {
      xAxisData.push(item.x);
      seriesData.push(item.value)
    })
    console.log(xAxisData)
    console.log(seriesData)

    const option = {
                grid:this.config.grid,
                legend: {
                    textStyle:{
                        color:'#9B9B9B'
                    },
                    right:37,
                    top: 22,
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLine:{
                        lineStyle:{
                            color:'#657CA8'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                      show:true,
                      ...this.config.xAxis
                    },
                },
                yAxis: {
                    splitNumber:4,
                    axisLine:{
                        lineStyle:{
                            color:'transparent'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        show: true,
                        lineStyle:{
                          color:'rgba(211,211,211,0.2)'
                        }
                            
                    },
                    axisLabel:{
                      show:true,
                        ...this.config.yAxis  
                    },
                },
                series: [
                    {
                        type: 'bar',
                        barWidth:20,
                        barWidth:7,
                        data: seriesData,
                        label: {
                            show: true,
                            position: 'top',
                            textStyle:{
                                color:'#63E1FF',
                                ...this.config.topNum
                            },
                            formatter: (params)=>{//单独对第一个label使用样式
                                    if (params.dataIndex === 4) {
                                        return '{a|'+params.value+'}'
                                    } 
                                },
                                rich: {//使用富文本编辑字体样式
                                    a: {
                                        color: '#FFEBA0',
                                        fontSize:20,
                                        ...this.config.topNum
                                    }
                                }
                        },
                        itemStyle:{
                            normal:{
                                color: function (params){
                                    var colorList = [
                                        ['rgba(90,206,236,1)','rgba(90,206,236, 0)'],
                                        ['rgba(90,206,236,1)','rgba(90,206,236, 0)'],
                                        ['rgba(90,206,236,1)','rgba(90,206,236, 0)'],
                                        ['rgba(90,206,236,1)','rgba(90,206,236, 0)'],
                                        ['rgba(255,235,160,1)','rgba(255,235,160,0)'],
                                        ['rgba(90,206,236,1)','rgba(90,206,236, 0)'],
                                    ];
                                    var index=params.dataIndex;
                                    if(params.dataIndex >= colorList.length){
                                            index=params.dataIndex-colorList.length;
                                    }
                                    return new Echarts.graphic.LinearGradient(0, 0, 0, 1,
                                        [
                                            {offset: 0, color: colorList[index][0]},
                                            {offset: 0.8, color: colorList[index][1]},
                                            {offset: 1, color: colorList[index][1]},
                                        ]);
                                },
                                
                            }
                        }
                    }
                ],
            animationDuration: 1000,
            animationEasing: 'elasticOut',
            animationEasing: "cubicInOut",
    };
    return option;
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var cfg = this.mergeConfig(config);
    //更新图表
    this.chart.setOption(this.getEchartsConfig(),true);
    // if(config){
    //   let lineStyle = config.yAxis.splitLine;
    //   config.yAxis.splitLine.value = lineStyle
    // }
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    this.chart.render({
     width: width,
     height: height
    })
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {

    console.log(config);
    if(config){
      let backgroundColorValue = config.grid.backgroundColor.value;
      config.grid.backgroundColor = backgroundColorValue;

      let borderColorValue = config.grid.borderColor.value;
      config.grid.borderColor = borderColorValue

      // let lineStyle = config.yAxis.splitLine;
      // config.yAxis.splitLine.value = lineStyle
    }

    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});