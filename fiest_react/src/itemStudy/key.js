import React from 'react';

class Keyid extends React.Component{
    constructor(props){
        super(props);
        this.state = {
             posts:[
                 {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
                 {id: 2, title: 'Installation', content: 'You can install React from npm.'}]
        }
    }

    render(){
        const {posts} = this.state
        return(
            <div>
                {posts.map(item => 
                            <div key={item.id}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        )}
             </div>
        )
    }
}

export default Keyid