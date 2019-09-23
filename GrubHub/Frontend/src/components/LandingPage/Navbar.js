import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import image from '../../burgerIm.jpg';

class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    render(){
        let navLogin = null;
        let menuIcon =null;
        let grubHub =null;
        let grubHubForRest=null;
        let userDetails=null
        // eslint-disable-next-line no-restricted-globals
        if(location.pathname.endsWith("/")||location.pathname.endsWith("/login")||location.pathname.endsWith("/signup")||location.pathname.endsWith("/LoginOwner")||location.pathname.endsWith("/SignUpOwner")){
            navLogin = "";
            menuIcon="";
            grubHub=(<a class="navbar-brand" href="/login">GRUBHUB</a>);
            grubHubForRest=(<li><a class="navbar-brand" href="/LoginOwner">GRUBHUB for Restaurants</a></li>);
        // eslint-disable-next-line no-restricted-globals
        }else if(location.pathname.endsWith("/HomeOwner")||location.pathname.endsWith("/UpdateDetailsOwner")||location.pathname.endsWith("/MenuOwner")){
            navLogin =(
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
            menuIcon =(<div class="dropdown">
            <button style={{marginTop:"20px"}} class="glyphicon glyphicon-th-list" type="button" data-toggle="dropdown">
            <span class="caret"></span></button>
            <ul class="dropdown-menu">
              <li><a href="/HomeOwner">Home</a></li>
              <li><a href="/MenuOwner">Menu</a></li>
              <li><a href="/UpdateDetailsOwner">Update Personal Details</a></li>
            </ul>
          </div>);
           // eslint-disable-next-line no-restricted-globals
        }else if(location.pathname.endsWith("/HomeOwner")||location.pathname.endsWith("/UpdateDetailsOwner")||location.pathname.endsWith("/MenuOwner")){
          navLogin =
          (
              <ul class="nav navbar-nav navbar-right">
                      <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
              </ul>
          );
          
          menuIcon =(<div class="dropdown">
          <button style={{marginTop:"20px"}} class="glyphicon glyphicon-th-list" type="button" data-toggle="dropdown">
          <span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li><a href="/HomeOwner">Home</a></li>
            <li><a href="/MenuOwner">Menu</a></li>
            <li><a href="/UpdateDetailsOwner">Update Personal Details</a></li>
          </ul>
        </div>);
        // eslint-disable-next-line no-restricted-globals
      }else if(location.pathname.endsWith("/UpdateDetails")||location.pathname.endsWith("/HomePage")||location.pathname.endsWith("/SearchPage")||location.pathname.endsWith("/DetailsPage")){ 
        navLogin =
        (
            <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
            </ul>
        );
        grubHub=(<a class="navbar-brand" href="/login">GRUBHUB</a>);
        userDetails=(<div class="dropdown">
        <button style={{marginTop:"20px"}} class="glyphicon glyphicon-th-list" type="button" data-toggle="dropdown">
        <span class="caret"></span></button>
        <ul class="dropdown-menu">
          <li><a href="/HomeOwner">Home</a></li>
          <li><a href="/MenuOwner">Menu</a></li>
          <li><a href="/UpdateDetailsOwner">Update Personal Details</a></li>
        </ul>
      </div>);
      }
  
        return(
            <div>
                
            <nav class="navbar navbar-inverse defaults">
            <div class="container-fluid ">
              <div class="navbar-header ">
                {grubHub}
                {menuIcon}
              </div>

              <ul class="nav navbar-nav navbar-right">
                {grubHubForRest}
                {navLogin}
                
              </ul>
            </div>
          </nav>
          </div>
        )
    }
}

export default Navbar;