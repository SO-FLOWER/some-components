import React from 'react';
//history模式/后端匹配使用
import {BrowserRouter as Router,Route,Link,Redirect,Switch} from 'react-router-dom'

//ReactRouter三大组件: 1.Router:所有路由组件的根组件，包裹路由规则的最外层容器。
                    //属性:basename->设置跟此路由根路径，router可以一个组件中写多个
                    //2.Route:路由规则匹配组件，显示当前规则对应组件。
                    //3.Link:路由跳转的组件。



//路由重定向
function LoginInfo(props){
    console.log(props);
    if(props.location.state.loginState === 'success'){
        return <Redirect to='/admin'></Redirect>
    }else{
        return <Redirect to='/login'></Redirect>
    }
}

let FormCom = ()=> {
    let pathObj = {
        pathname:'/logininfo',
        state:{
            loginState:'success'
        }
    }
    return(
        <div>
            <h1>表单验证</h1>
            <Link to={pathObj}>登录验证后页面</Link>
        </div>
    )
}


//通过js点击事件进行页面跳转
class ChildCom extends React.Component{
    render(){
        return(
            <div>
                <button onClick={this.clickEvent}>跳转到首页</button>
            </div>
        )
    }
    clickEvent = () => {
        console.log(this.props);
        this.props.history.push('/',{msg:'这是ChildCom组件给首页发送的数据'})
    }
}

class App extends React.Component{
    render(){
        return(
            <div>
                <Router>
                    <Switch>
                        <Route path="/" exact component={()=>(<h1>首页</h1>)}></Route>
                        <Route path='/admin' exact component={()=>(<h1>admin页面，登录成功</h1>)}></Route>
                        <Route path='/login' exact component={()=>(<h1>登录页面</h1>)}></Route>
                        <Route path='/logininfo' exact component={LoginInfo}></Route>
                        <Route path='/form' exact component={FormCom}></Route>
                        <Route path='/abc' exact component={()=>(<h1>这是abc1</h1>)}></Route>
                        <Route path='/abc' exact component={()=>(<h1>这是abc2</h1>)}></Route>
                        <Route path='/child' exact component={ChildCom}></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App