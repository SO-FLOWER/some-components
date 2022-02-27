import React from 'react';
import ReactDOM from 'react-dom';

//react 插槽:  组件中写入内容，这些内容可以识别和控制。 
//      原理： 组件中写入HTML，可以传入到props中。

class ParentCom extends React.Component{
  render(){
    return(
      <div>
        <h1>组价插槽</h1>
        {this.props.children}
        <ChildCom>
            <h1 data-position = "hearder">这是放置到头部的内容</h1>
            <h1 data-position = "mainCom">这是放置到主要的内容</h1>
            <h1 data-position = "footer">这是放置到尾部的内容</h1>
        </ChildCom>
      </div>
    )
  }
}

class ChildCom extends React.Component{
  render(){
    let hearderCom,mainCom,footerCom;
    console.log(this.props.children);
    this.props.children.forEach((item,index)=>{
        if(item.props['data-position'] === 'hearder'){
          hearderCom = item
        }else if(item.props['data-position'] === 'mainCom'){
          mainCom = item
        }else{
          footerCom = item
        }
    })
    return(
      <div>
         <div className="hearder">{hearderCom}</div>
         <div className="mainCom">{mainCom}</div>
         <div className="footerCom">{footerCom}</div>
      </div>
    )
  }
}

class RootCom extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      arr:[1,2,3]
    }
  }
  render(){
    return(
      <ParentCom>
            <h2 data-name="a" data-index={this.state.arr[0]}>子组件1</h2>
            <h2 data-name="b" data-index={this.state.arr[1]}>子组件2</h2>
            <h2 data-name="c" data-index={this.state.arr[2]}>子组件3</h2>
      </ParentCom>
    )
  }
}

ReactDOM.render(
   <RootCom></RootCom>,
   document.querySelector('#root')
)