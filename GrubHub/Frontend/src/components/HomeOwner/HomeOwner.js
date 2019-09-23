import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Sidebar from '../sidebar/sidebar';
import {Navbar, Nav, NavItem, Button} from 'react-bootstrap';
import { slide as Menu } from 'react-burger-menu';
import {Route} from 'react-router-dom';

import UpdateDetailsOwner from '../UpdateDetailsOwner/UpdateDetailsOwner';
class HomeOwner extends Component{

    constructor(props) {
        super(props);
 
        this.state = {
          isVisible: false,
        };
    }
 
    updateModal(isVisible) {
    	this.state.isVisible = isVisible;
      this.forceUpdate();
    }

    render(){

        return(
            <div>
           
            <div class="col-sm-3">
           </div>
           <div class="col-sm-3">Hi</div>
        </div>
            
         )
        
        
    }
}
//export Login Component
export default HomeOwner;