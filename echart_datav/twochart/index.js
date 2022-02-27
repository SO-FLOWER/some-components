var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
var Echarts = require('echarts');
const { min } = require('lodash');
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
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    // this.updateStyle();
    this.chart = Echarts.init(this.container[0]);
    this.chart.setOption(this.getEcharts(),true);
  },
  getEcharts(){

    if(!this._data){
      return{}
    }
    const xData=[];
    const yData1=[];
    const yData2=[];
    // let borderHeight=this._data.length <= 0? [] : [1500,1500,1500];
    // if(this._data <= 0){
    //     borderHeight = []
    // }else{
    //     let list = [];
    //     this._data.map(val=>{ list.push(val.y1); list.push(val.y2)})
    //     let minnum = Math.min(...list);
    //     let maxnum = Math.max(...list);
    //     console.log(minnum + '' + maxnum)
    //     if(minnum>0 && maxnum<200){
    //         borderHeight = [3,3,3]
    //     }else if(minnum>200 && maxnum < 500){
    //         borderHeight =  [50,50,50]
    //     }else{
    //         borderHeight =  [3,3,3]
    //     }
    // }
     
    let border = this.config.topNum.height;
    let borderHeight = [border,border,border]
    let Left = this.config.topNum.leftbar;
    let Topleft = this.config.topNum.topleft;
    let Right = this.config.topNum.rightbar;
    let Topright = this.config.topNum.topright;

    this._data.map(item => {
      xData.push(item.x);
      yData1.push(item.y1);
      yData2.push(item.y2);
    })

    colorArr = [
        {
            start: "rgba(71, 173, 245,",
            end: "rgba(18, 58, 86,0)"
        },
        {
            start: "rgba(82, 249, 107,",
            end: "rgba(18, 58, 86,0)"
        }
    ];
    let seriesData = [];
    var legend = ["中国", "美国"]
    var obj1 = {};
    var obj2 = {};
    var obj3 = {};
    var obj4 = {};
  
        obj1 = {
            name: legend[0],
            type: "bar",
            barGap:1, 
            stack: legend[0], 
            data: yData1,
            barWidth: "10px",
            itemStyle: {
                normal: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                                offset: 0,
                                color: colorArr[0].start + "0.7)"
                            },
                            {
                                offset: 0.5,
                                color: colorArr[0].start + "0.3)"
                            },
                            {
                                offset: 1,
                                color: colorArr[0].end
                            }
                        ],
                        globalCoord: false
                    }
                }
            },
            label: {
                show: true,
                position:[Left,Topleft],
                textStyle:{
                    color:'#63E1FF',
                    ...this.config.topNum
                }
            }
          
        };
        obj2 = {
            name: "",
            type: "bar", 
            stack: legend[0],                                            
            itemStyle: {
                normal: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                                offset: 0.7,
                                color: colorArr[0].start + "0.7)"
                            },
                            {
                                offset: 1,
                                color: colorArr[0].end
                            }
                        ],
                        globalCoord: false
                    }
                }
            },
          
            data: borderHeight
        };
        
        obj3 = {
            name: legend[1],
            type: "bar",
            barGap:1,
            stack: legend[1], 
            data: yData2,
            barWidth: "10px",
            itemStyle: {
                normal: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                                offset: 0,
                                color: colorArr[1].start + "0.7)"
                            },
                            {
                                offset: 0.5,
                                color: colorArr[1].start + "0.3)"
                            },
                            {
                                offset: 1,
                                color: colorArr[1].end
                            }
                        ],
                        globalCoord: false
                    }
                }
            },
            label: {
                show: true,
                position:[Right,Topright],
                textStyle:{
                    color:'#63E1FF',
                    ...this.config.topNum
                }
            }
          
        };
        obj4 = {
            name: "",
            type: "bar",
            stack: legend[1],  
            itemStyle: {
                normal: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                                offset: 0.7,
                                color: colorArr[1].start + "0.7)"
                            },
                            {
                                offset: 1,
                                color: colorArr[1].end
                            }
                        ],
                        globalCoord: false
                    }
                }
            },
          
            data: borderHeight
        }; 
        seriesData.push(obj1);
        seriesData.push(obj2);
        seriesData.push(obj3);
        seriesData.push(obj4);
    
    const option = {
        grid: {...this.config.grid},
        xAxis: [{
            type: "category",
            data: xData,
            label: {
                show: true,
                position: 'top',
                textStyle:{
                    color:'#63E1FF',
                    fontSize:20
                }
            },
            axisPointer: {
                type: "shadow"
            },
            axisLabel: {
                show:true,
                ...this.config.xAxis
            },
            axisLine: {
                lineStyle: {
                    color: "rgba(255,255,255,0.5)"
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
                type: "value",
                // "min": 0,
                // "max": 50,
                axisLabel: {
                    show:false,
                },
                axisLine: {
                    lineStyle: {
                        color: 'transparent'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false,
                }
            }
        ],
        series: seriesData,
        animationDuration: 1000,
        animationEasing: 'elasticOut',
        animationEasing: "cubicInOut",
    };
    return option
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
    this.chart.setOption(this.getEcharts(),true);
    //更新图表
    //this.chart.render(data, cfg);
    // this.container.html(data[0].value)
    //如果有需要的话,更新样式
    // this.updateStyle();
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

    if(config){
        let backgroundColorValue = config.grid.backgroundColor.value;
        config.grid.backgroundColor = backgroundColorValue;

        let borderColorValue = config.grid.borderColor.value;
        config.grid.borderColor = borderColorValue;
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