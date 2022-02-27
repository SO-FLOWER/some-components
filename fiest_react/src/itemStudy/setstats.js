import React from 'react';

class Setstates extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            clickCount:0
        }
    }

    handleConut = () =>{
        this.setState(function(state){
          return {clickCount: state.clickCount + 1}
        })
    }

    render(){
        return(
            <div>
                <h2 onClick={this.handleConut}>点我！次数为:{this.state.clickCount}</h2>
            </div>
        )}
}

export default Setstates