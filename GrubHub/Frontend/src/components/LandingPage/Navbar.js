import React, { Component } from 'react';
import cookie from 'react-cookies';


class Navbar extends Component {
  constructor(props) {

    super(props);
    this.state = {
      firstName: ""
    }
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout = () => {
    cookie.remove('cookie', { path: '/' })
  }
  componentDidUpdate(){
    console.log("hi")
  }
  render() {
    let menuIcon = null;
    let grubHub = null;
    let grubHubForRest = null;
    let userDetails = null
    // eslint-disable-next-line no-restricted-globals
    if (location.pathname.endsWith("/") || location.pathname.endsWith("/login") || location.pathname.endsWith("/signup") || location.pathname.endsWith("/LoginOwner") || location.pathname.endsWith("/SignUpOwner")) {
      grubHub = (<a class="navbar-brand" href="/login">GRUBHUB</a>);
      grubHubForRest = (<li><a class="navbar-brand" href="/LoginOwner">GRUBHUB for Restaurants</a></li>);
      // eslint-disable-next-line no-restricted-globals
    } else if (location.pathname.endsWith("/HomeOwner") || location.pathname.endsWith("/UpdateDetailsOwner") || location.pathname.endsWith("/MenuOwner")||location.pathname.endsWith("/PastOrderOwner")) {
      grubHub = (<a class="navbar-brand" href="/LoginOwner">GRUBHUB for Restaurants</a>);
      userDetails = (<div class="dropdown" style={{ marginRight: '85px' }}>
        <button class="btn btn-default btn-lg dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">Hi, {sessionStorage.getItem("OwnerFirstName")} !
        <span class="caret" style={{ marginLeft: '5px' }}></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1" style={{ width: '50px', minWidth: '250px', paddingLeft: '10px', textAlign: 'center', color: 'blue' }}>

          <div class="row">
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href='/HomeOwner'><span class="glyphicon glyphicon-cutlery"></span></a></li></div>
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href="/PastOrderOwner"><span class="glyphicon glyphicon-time"></span></a></li></div>
          </div>
          <div class="row">
            <div class="col-md-6">Active Orders</div>
            <div class="col-md-6">Past Orders</div>
          </div>
          <div class="row" style={{ marginTop: '20px' }}>
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href='/UpdateDetailsOwner'><span class="glyphicon glyphicon-cog"></span></a></li></div>
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href="/MenuOwner"><span class="glyphicon glyphicon-menu-hamburger"></span></a></li></div>

          </div>
          <div class="row">
            <div class="col-md-6">Profile</div>
            <div class="col-md-6">Edit Menu</div>
          </div>
          <li role="presentation" class="divider" ></li>
          <div style={{ color: 'black', fontSize: '18px' }}>Not {sessionStorage.getItem("OwnerFirstName")} ? <a href="/" style={{ color: 'blue' }} onClick={this.handleLogout}>Sign Out</a></div>

        </ul>
      </div>);
 
      // eslint-disable-next-line no-restricted-globals
    } else if (location.pathname.endsWith("/UpdateDetails") || location.pathname.endsWith("/HomePage") || location.pathname.endsWith("/SearchPage") || location.pathname.endsWith("/DetailsPage") || location.pathname.endsWith("/ReviewPage") || location.pathname.endsWith("/UpcomingOrder") || location.pathname.endsWith("/PastOrder")) {
      grubHub = (<a class="navbar-brand" href="/login">GRUBHUB</a>);
      userDetails = (<div class="dropdown" style={{ marginRight: '85px' }}>
        <button class="btn btn-default btn-lg dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">Hi, {sessionStorage.getItem("FirstName")} !
        <span class="caret" style={{ marginLeft: '5px' }}></span></button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1" style={{ width: '50px', minWidth: '250px', paddingLeft: '10px', textAlign: 'center', color: 'blue' }}>

          <div class="row">
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href="/PastOrder"><span class="glyphicon glyphicon-time"></span></a></li></div>
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href="/UpcomingOrder"><span class="glyphicon glyphicon-calendar"></span></a></li></div>
          </div>
          <div class="row">
            <div class="col-md-6">Past Orders</div>
            <div class="col-md-6">Upcoming Orders</div>
          </div>
          <div class="row" style={{ marginTop: '20px' }}>
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href='/UpdateDetails'><span class="glyphicon glyphicon-cog"></span></a></li></div>
            <div class="col-md-6"><li style={{ fontSize: '40px' }}><a href='/HomePage'><span class="glyphicon glyphicon-home"></span></a></li></div>
          </div>
          <div class="row">
            <div class="col-md-6">Update Details</div>
            <div class="col-md-6">Home</div>
          </div>
          <li role="presentation" class="divider" ></li>
          <div style={{ color: 'black', fontSize: '18px' }}>Not {sessionStorage.getItem("FirstName")} ? <a href="/" style={{ color: 'blue' }} onClick={this.handleLogout}>Sign Out</a></div>

        </ul>
      </div>);
    }

    return (
      <div>

        <nav class="navbar navbar-inverse defaults">
          <div class="container-fluid ">
            <div class="navbar-header ">
              {grubHub}
              {menuIcon}
            </div>

            <ul class="nav navbar-nav navbar-right">
              {grubHubForRest}
              {userDetails}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar;