import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date: new Date()
        }
    };

    componentDidMount(){
        this.timerID = setInterval(
            () => {this.setState({date: new Date()})},
            1000
        )
    }

    componentWillMount(){
        clearInterval(this.timerID);
    }

    // tick(){
    //     this.setState({
    //         date:new Date()
    //     });
    // }

    render(){
        let t = this.state.date;
        let year = t.getFullYear();
        let month = t.getMonth() + 1;
        let day = t.getDay();
        // let hour = ((t.getHours() < 10) ? "0" : "") + t.getHours();
        // let minutes = ((t.getMinutes() < 10) ? "0" : "") + t.getMinutes();
        // let ifnoon = '' + ((t.getHours() < 12) ? "上午" : "下午") + '';
        return(
            <div>
                <h2>现在是{this.state.date.toLocaleTimeString()}</h2>
                <h2>{year + '/' + month + '/' + day }</h2>
            </div>
        )
    }
}

export default Clock