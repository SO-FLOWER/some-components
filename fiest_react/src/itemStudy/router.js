import React from 'react';
//history模式/后端匹配使用
import {BrowserRouter as Router,Route} from 'react-router-dom'

//ReactRouter三大组件: 1.Router:所有路由组件的根组件，包裹路由规则的最外层容器。
                    //属性:basename->设置跟此路由根路径，router可以一个组件中写多个
                    //2.Route:路由规则匹配组件，显示当前规则对应组件。
                    //3.Link:路由跳转的组件。

function Home(){
    return(
        <div><h1>admin首页</h1></div>
    )
}

function Me(){
    return(
        <div><h1>admin个人中心</h1></div>
    )
}

function Product(){
    return(
        <div><h1>admin产品页面</h1></div>
    )
}

class App extends React.Component{
    render(){
        return(
            <div id='app'>
                <Router>
                    <Route path='/' exact component={()=>(<div>首页</div>)}></Route>
                    <Route path='/me' component={()=>(<div>me</div>)}></Route>
                    <Route path='/product' component={()=>(<div>product</div>)}></Route>
                </Router>
                <Router>
                    {/* <div className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/product">Product</Link>
                        <Link to="/me">Me</Link>
                    </div> */}
                    <Route path='/admin/' exact component={Home}></Route>
                    <Route path='/admin/product' component={Product}></Route>
                    <Route path='/admin/me' exact component={Me}></Route>
                </Router>
            </div>
        )
    }
}

export default App