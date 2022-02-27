import React from 'react';

function LoginButton(props){
    return(
        <button onClick={props.onClick}>
            登录
        </button>
    )
}


function LogoutButton(props){
    return(
        <button onClick={props.onClick}>
            退出
        </button>
    )
}


class Condition extends React.Component{
    constructor(props){
        super(props);
        this.state = {
             isLoggedIn:false
        }
    }

    handleLogoutClick = () => {
       this.setState({isLoggedIn:false})
    }

    handleLoginClick = () => {
        this.setState({isLoggedIn:true})
    }

    render(){
        const isLoggedIn = this.state.isLoggedIn;
        let button;
        if(isLoggedIn){
            button = <LogoutButton onClick={this.handleLogoutClick}/>;
        }else{
            button = <LoginButton onClick={this.handleLoginClick}/>;
        }
        return(
            <div>
                <Greeting isLoggedIn={isLoggedIn}></Greeting>
                {button}
            </div>
        )
    }
}

function UserGreeting(props){
    return <h1>欢迎回来</h1>
}

function GuestGreeting(props){
    return <h1>请先注册</h1>
}

function Greeting(props){
    const isLoggedIn = props.isLoggedIn;
    if(isLoggedIn){
        return <UserGreeting />
    }else{
        return <GuestGreeting />
    }
}

export default Condition