import React from 'react';
import '../itemStudy/preventrender.css'

function WarningBanner(props){
    if(!props.warn){
        return null
    }
    return(
        <div className="warning">
            警告！！！
        </div>
    )
}

class PreventRender extends React.Component {
    constructor(props){
       super(props);
       this.state = {
           showWarning:true
       }
    }

    HandleToggleClick = () => {
        this.setState(prevState => ({
            showWarning: !prevState.showWarning
        }));
    }

    render(){
        return(
            <div>
                <WarningBanner warn={this.state.showWarning}></WarningBanner>
                <button onClick={this.HandleToggleClick}>
                     {this.state.showWarning ? '隐藏' : '显示'}
                </button>
            </div>
        )
    }
}

export default PreventRender;