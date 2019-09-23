import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import Sidebar from '../sidebar/sidebar';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import {DropdownButton} from 'react-bootstrap'
import {Dropdown} from 'react-bootstrap'
class Delete extends Component{
    constructor(props){
        super(props);
        this.state = {
            BookID : "",
            errorMessage :[],
            authFlag : false
        }
        
    }
  

    render(){
    
        var redirectVar = "";
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/LoginOwner" />
        }
        return(
            
            <div>
            {redirectVar}
            

                
        </div>


          
            
        )
    }
}

export default Delete;