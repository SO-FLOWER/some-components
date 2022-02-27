var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
var echarts = require('echarts');
//var Chart = require('XXX');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  };
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.$div = null;
  this.$selcet = null;
  this.$span = null;
  this.history=['四川省'];
  this.redata = {};
  this.init(config);
  this.url = "xzqh:"
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
    this.chart = echarts.init(this.container[0]);
    this.$div = $('<div>',{
      css:{
        "display":config.select.boxShow,
        "position":"absolute",
        "top":config.select.top,
        "left":config.select.left,
        "width":"400px",
        "height":"40px",
        "color":"#000000"
      }
    });
    this.$span = $('<span>',{
      css:{
        color:'#ffffff'
      }
    });
    this.$span.html('四川省>');
    this.container.append(this.$div);
    this.$select = $("<select>",{
      css:{
        "background":config.select.background,
        "height":config.select.height,
        "width":config.select.width,
        "line-height":config.select.height,
        "font-size":config.select.font.fontSize,
        "color":config.select.font.color,
        "border":config.select.border.width + "px "+config.select.border.style +" "+config.select.border.color,
        "-moz-border-radius":"2px",
        "-webkit-border-radius":"2px",
        "border-radius":"2px",
      }
    });
    this.$div.append(this.$span).append(this.$select);
    this.$div.on('click','a',()=>{
      if (this.history.length === 1){
        return
      }
      this.history.pop();
      this.redata.name = this.url + this.history[this.history.length - 1];
      this.emit('click-map',this.redata);
      this.upSpan();
    });
    let that = this;
    this.$select.on('change',function(e){
      that.history.push(this.value);
      that.redata.name = that.url + this.value;
      that.emit('click-map',that.redata);
      that.upSpan();
    });
    this.chart.on('click',(e)=>{
      this.redata.name = this.url+e.name;
      this.history.push(e.name);
      this.emit('click-map',this.redata);
      this.upSpan();
    });
    //4.如果有需要, 更新样式
    this.updateStyle();
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
    echarts.registerMap('map', data);
    let option = {
      title: {
        text: cfg.title.text,
        left: cfg.title.left,
        textStyle:{
          color:cfg.title.textStyle.color,
          fontSize:cfg.title.textStyle.fontSize,
        },
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter:'{b}'
      },
      series: [
        {
          name: 'USA PopEstimates',
          type: 'map',
          roam: true,
          map: 'map',
          label: {
            show: cfg.map.label.isShow,
            color:cfg.map.label.color,
            fontSize:cfg.map.label.fontSize,
          },
          itemStyle:{
            areaColor:cfg.map.itemStyle.areaColor,
            borderColor:cfg.map.itemStyle.borderColor,
            borderWidth:cfg.map.itemStyle.borderWidth
          },
          emphasis:{
            label:{
              show: cfg.emphasis.label.isShow,
              color:cfg.emphasis.label.color,
              fontSize:cfg.emphasis.label.fontSize,
            },
            itemStyle:{
              areaColor:cfg.emphasis.itemStyle.areaColor,
              borderColor:cfg.emphasis.itemStyle.borderColor,
              borderWidth:cfg.emphasis.itemStyle.borderWidth
            },
          }
        }
      ]
    };
    this.chart.setOption(option);

    //如果有需要的话,更新样式
    this.updateStyle();
  },
  handler:function(data){
    this.$select.empty();
    this.$select.append(`<option disabled style="display: none" selected value>请选择</option>`);
    for (let i = 0; i < data.length; i++) {
      this.$select.append(`<option value="${data[i].name}">${data[i].name}</option>`)
    }
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
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
      'color': cfg.color || '#fff',
      'width':cfg.width + 'px',
      'height':cfg.height + 'px'
    });
    this.chart.resize(cfg.width,cfg.height);
    this.$select.css({
        "background":cfg.select.background,
        "height":cfg.select.height,
        "width":cfg.select.width,
        "line-height":cfg.select.height,
        "font-size":cfg.select.font.fontSize,
        "color":cfg.select.font.color,
        "border":cfg.select.border.width + "px "+cfg.select.border.style +" "+cfg.select.border.color,
    })
    this.$div.css({
      "display":cfg.select.boxShow,
      "top":cfg.select.top,
      "left":cfg.select.left,
    })
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
   destroy: function(){console.log('请实现 destroy 方法')},
   upSpan:function () {
     if (this.history.length === 0){
       this.$span.html('>');
     } else {
       this.$span.html(`<a style="cursor: pointer">${this.history[this.history.length -1]}</a>` + '>');
     }
   },
});
