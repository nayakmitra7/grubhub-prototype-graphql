import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../../../App.css';

class HomeOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      orderStatus: "",
      buyerAddress: "",
      orderDate: "",
      orderDetails: [],
      buyerFirstName: "",
      buyerLastName: "",
      New: "active",
      Confirmed: "",
      Preparing: "",
      Ready: "",
      Cancelled: "",
      titleName: "New Orders",
      orderId: ""
    }

  }

  render() {
    let redirectVar ='';
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/HomePage" />
    }
   
    return (

      <div>
        {redirectVar}
        <p style={{ color: 'crimson', fontWeight: '900', fontSize: '40px', marginLeft: '600px', marginTop: '0px' }}>{sessionStorage.getItem("RestaurantName")}</p>
        <p style={{ color: 'blue', fontWeight: '900', fontSize: '25px', marginLeft: '40px', marginTop: '0px' }}>{this.state.titleName}</p>
        <ul class="nav nav-tabs" style={{fontSize:'18px',marginLeft:'55px'}}>
          <li class={this.state.New}><a onClick={this.newOrders}><p>New</p> </a></li>
          <li class={this.state.Confirmed}><a><p style={{paddingBottom:'0px'}}>Confirmed</p></a></li>
          <li class={this.state.Preparing}><a><p style={{paddingBottom:'0px'}}>Preparing</p></a></li>
          <li class={this.state.Ready}><a><p style={{paddingBottom:'0px'}}>Ready</p></a></li>
          <li class={this.state.Cancelled}><a><p style={{paddingBottom:'0px'}}>Cancelled</p></a></li>

        </ul>
      </div>




    )
  }
}

export default HomeOwner;