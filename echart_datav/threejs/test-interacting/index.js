var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');
// var THREE = require('three');
// var OBJLoader = require('three-obj-mtl-loader').OBJLoader;
// var ThreeLoader = require('three-obj-mtl-loader');
// var OBJLoader = require('three-obj-loader');
// console.log('ThreeLoader',ThreeLoader)
// console.log('OBJLoader',OBJLoader)
// import * as THREE from 'three';
// var { OBJLoader } = require('three-obj-mtl-loader');
var THREE = require('./resources/js/three.module.js');
console.log('THREE',THREE)
var threeContainer;
var camera, scene, threeRenderer;
var mouseX = 0, mouseY = 0;

// let windowHalfX = window.innerWidth / 2;
// let windowHalfY = window.innerHeight / 2;
var windowHalfX = 500 / 2;
var windowHalfY = 500 / 2;

var threeObject = "";

function threeInits(cfg) {
        var {OBJLoader} = require('./resources/js/OBJLoader.js');
        console.log('OBJLoader',OBJLoader)

        threeContainer = document.createElement( 'div' );
        // document.body.appendChild( container );
        document.getElementById('info').appendChild( threeContainer );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        // camera.position.z = 500;
        camera.position.set(200, 300, 800);

        // scene

        scene = new THREE.Scene();

        // 环境光
        const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        scene.add( ambientLight );

        // 点光源
        const pointLight = new THREE.PointLight( 0xffffff, 0.8);
        // pointLight.position.set(400, 200, 300); // 位置
        camera.add( pointLight );

        //创建场景旋转缩放事件
        // let controls = new THREE.TrackballControls(camera); 

        scene.add( camera );


        const manager = new THREE.LoadingManager( loadModel );
        manager.onProgress = function ( item, loaded, total ) {
          console.log( item, loaded, total );
        };

        var objLoader = new OBJLoader(manager);
        // texture 材质
        const textureLoader = new THREE.TextureLoader( manager );
        // const texture = textureLoader.load( './objLoader/img/uv_grid_opengl.jpg' );
        // const texture1 = textureLoader.load( './objLoader/img/jinshu.jpeg' );
         // objLoader.load( './objLoader/models/obj/male01.obj', function ( obj ) {

        //   threeObject = obj;

        // }, onProgress, onError );
        const texture = textureLoader.load( cfg.a );
        const texture1 = textureLoader.load(cfg.b );
        objLoader.load( cfg.c, function ( obj ) {

          threeObject = obj;

        }, onProgress, onError );

        // manager

        function loadModel() {
          threeObject.traverse( function ( child ) {
            if ( child.isMesh ) child.material.map = texture;
          } );
          // threeObject[1].traverse( function ( child ) {
          //   if ( child.isMesh ) child.material.map = texture1;
          // } );
          threeObject.position.y = -100;
          // threeObject[1].position.y = - 95;
          // scene.add( threeObject[0], threeObject[1] );
          scene.add( threeObject);
        }
       

        // model 模型

        function onProgress( xhr ) {

          if ( xhr.lengthComputable ) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

          }

        }

        function onError() {}

        // const loader = objLoader( manager );
        // loader.load( './objLoader/models/obj/male02.obj', function ( obj ) {

        //   threeObject.push(obj);

        // }, onProgress, onError );

        

        threeRenderer = new THREE.WebGLRenderer();
        threeRenderer.setPixelRatio( window.devicePixelRatio );
        // renderer.setSize( window.innerWidth, window.innerHeight );
        threeRenderer.setSize( 500, 500 );
        threeContainer.appendChild( threeRenderer.domElement );

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        // window.addEventListener( 'click', getIntersects, false );
        //
        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        threeRenderer.setSize( window.innerWidth, window.innerHeight );

      }

      function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;

      }

      //

      function threeAnimate() {
        requestAnimationFrame( threeAnimate );
        threeRender();
      }
      //
      function threeRender() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        threeRenderer.render( scene, camera );

      }


/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  };
  // this.themeConfig = {
  //   "bgColor": "#202020",        // 背景颜色
  //   "textColor": "#FFFFFF",     // 文本颜色
  //   "axisColor": "#FFFFFF",    // 坐标轴颜色
  //   "assistColor": "#FFFFFF", // 辅助信息颜色
  //   "palette": [             // 系列颜色
  //     "#85A5FF",
  //     "#597EF7",
  //     "#2F54EB",
  //     "#1D39C4",
  //     "#10239E",
  //     "#061178",
  //     "#030852"
  //   ]
  // };
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
    // var html = "<div style=''></div>"
    //更新图表
    //this.chart.render(data, cfg);
    var html = require('./resources/index.html');
    this.container.html(html)
    // this.container.html(data[0].value)
    // this.container.css({
    //   'width': cfg.width + 'px',
    //   'height': cfg.heihgt + 'px',
    //   'border-radius': '50%',
    //   'display': 'flex',
    //   'align-items': 'center',
    //   'justify-content': 'center'
    // })
    //如果有需要的话,更新样式
    // this.updateStyle();
    this.emit('valueChange', data[0].value);
    console.log(cfg)
    threeInits(cfg);
    threeAnimate();
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
  emit: function(event_name, value){},
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
  // show() {
  //   this.container.show();
  // },
  // hide() {
  //   this.container.hide();
  // },
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


  // getThemableConfig: function(themeConfig) {
  //    if (!themeConfig) return null;
  //    const themeMap = {
  //    color: themeConfig.textColor,
  //    bgColor: palette[0]
  //    }
  //    return themeMap;
  //   },

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
      'background-color': cfg.bgColor || '#f5f5f5',
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