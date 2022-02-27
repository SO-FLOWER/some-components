var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');
require('./index.css')

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
  // this.$span = null;
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
    this.container.html(`<div style="width: 490px;">
                            <div class="title">
                                <span class="detection">序列</span>
                                <span class="detection">监测站</span>
                                <span class="detection">水位</span>
                                <span class="detection">幅度</span>
                                <span class="detection">上报时间</span>
                            </div>
                            <ul id="contain">
                            </ul>
                          </div>`)
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
    //this.chart.render(data, cfg);
    // this.container.html(data[0].value)
    //如果有需要的话,更新样式
    this.randerHtml();
    this.updateStyle();   
  },

  randerHtml(){
      //  var url = window.location.href

      //  setInterval(() => {
      //      window.location.href = url;
      //  },10000)

       if(!this._data){
        return{}
       } 

       let UL = document.getElementById('contain');
       UL.innerHTML = ""
       let dataList1 = [];
       if(window.sessionStorage.getItem('data')){
           dataList1  = window.sessionStorage.getItem('data')
           dataList1 = JSON.parse(dataList1)
          //  console.log(dataList1)
       }
       var dataList = this._data;
      //  console.log(dataList)

       window.sessionStorage.setItem('data',JSON.stringify(dataList) );
       if(dataList1.length > 0){
           dataList.map((val,index)=>{
              //  console.log(dataList1[index].Water)
               if(val.water>dataList1[index].water){
                  //  console.log(val.Water,dataList1[index].Water,'大于')
                           var Li = document.createElement('li');
                           Li.innerHTML = `
                                               <span class='sets'>${val.id}</span>
                                               <span class="detection">${val.detection}</span>
                                               <span><div class='sets'>${val.water}m</div> <div class='one'></div></span>
                                               <span class='sets'>${val.range}</span>
                                               <span>
                                                  <div class='sets'>${val.time}</div>
                                                  <div class="detection">时</div>
                                               </span>
                                           `
                          
                           UL.appendChild(Li)
               }else{
                  //  console.log(val.Water,dataList1[index].Water,'小于等于');
                           var Li = document.createElement('li');
                           Li.innerHTML = `
                                               <span class='sets'>${val.id}</span>
                                               <span class="detection">${val.detection}</span>
                                               <span><div class='sets'>${val.water}m</div> <div class='two'></div></span>
                                               <span class='sets'>${val.range}</span>
                                               <span>
                                                  <div class='sets'>${val.time}</div>
                                                  <div class="detection">时</div>
                                               </span>
                                           `
                            
                           UL.appendChild(Li)
               }
           })
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
    console.log(cfg)
    this.container.find('.detection').css({
      fontFamily:cfg.fontStyle
    })
    this.container.find('.sets').css({
      fontFamily:cfg.numStyle
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
   destroy: function(){console.log('请实现 destroy 方法')}
});