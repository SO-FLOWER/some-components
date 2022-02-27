import React from 'react';
import ReactDOM from 'react-dom'
import {createStore} from 'redux'

//redux只是一种状态管理的解决方案: store:数据仓库，保存数据的地方  state:一个对象，数据仓库里的所有
//        数据都放到一个state里    action:一个动作，触发数据改变的方法   dispatch:将动作触发成方法   
//        reducer只是一种状态管理的解决方案。

//用于通过动作，创建新的state
const reducer = function(state={num:0},action){
    console.log(action);
    switch(action.type){
        case 'add':
            state.num++;
            break;
        case 'decrement':
            state.num--;
            break;
        default:
            break;
    }
    return {...state} //相当于对象的copy 解构赋值再创建给新的对象
}

//创建仓库
const store = createStore(reducer)
console.log(store);

function add(){
    //通过仓库的方法dispatch进行修改数据
    store.dispatch({type:'decrement'})
    console.log(store.getState());
}

function decrement(){
    //通过仓库的方法dispatch进行修改数据
    store.dispatch({type:'add',content:{id:1,msg:'helloworld'}})
    console.log(store.getState());
}

//函数式计数器
const Counter = function(props){
    let state = store.getState()
    return(
        <div>
            <h1>计数数量：{state.num}</h1>

            <buuton onClick={add}>计数加一</buuton>
            <buuton onClick={decrement}>计数减一</buuton>
        </div>
    )
}

ReactDOM.render(
    <Counter></Counter>,
    document.querySelector('#root')
)

store.subscribe(()=>{
    ReactDOM.render(
        <Counter></Counter>,
        document.querySelector('#root')
    )
})