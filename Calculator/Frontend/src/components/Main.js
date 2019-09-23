import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Home from './Home/Home';

//Create a Main Component
class Main extends Component {
    render(){
        return(
                          
                <Route path="/" component={Home}/>
            
        )
    }
}
//Export The Main Component
export default Main;