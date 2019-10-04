import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import {address} from '../../constant'

class PastOrderOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            orderStatus: "",
            buyerAddress: "",
            orderDate: "",
            orderDetails: [],
            buyerFirstName:"",
            buyerLastName:""

        }

    }
    componentDidMount() {
        console.log(sessionStorage.getItem("RestaurantId"))
        axios.get(address+'/OrdersOwner/' + sessionStorage.getItem("RestaurantId"))
            .then(response => {
                if (response.status === 200) {
                    this.setState({ orders: response.data })
                    console.log(response.data)
                }

            });
    }
    trackOrder = (e) => {
        document.getElementById("TrackOrder").style.display = "block"
        var order = this.state.orders.filter((order) => {
            if (order.orderId == e.target.id) {
                return order
            }
        })
        this.setState({
            orderStatus: order[0].orderStatus,
            buyerFirstName: order[0].buyerFirstName,
            buyerLastName:order[0].buyerLastName,
            buyerAddress: order[0].buyerAddress,
            orderDate: order[0].orderDate,
            orderDetails: JSON.parse(order[0].orderDetails)
        })

    }
    modalClose = () => {
        document.getElementById("TrackOrder").style.display = "None"
    }
    render() {

        var redirectVar = "";
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/HomePage" />
        }
        var array = [];
        if (this.state.orders.length) {

        } else {
            array.push(<div class="NoOrder"></div>)
        }
        this.state.orders.map((order) => {
            if (order.orderStatus == "Delivered" || order.orderStatus == "Cancelled" ) {
                var val = JSON.parse(order.orderDetails);
                var array2 = []

                val.map((item) => {
                    array2.push(<div class="row" style={{ marginLeft: '0px' }}>
                        <div class="col-md-4">{item.itemName} X {item.itemCount}</div>
                        <div class="col-md-4"></div>
                        <div class="col-md-4"></div>
                    </div>)
                })

                array.push(<div class="row embossed-heavy" style={{ marginLeft: '100px', marginRight: '140px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white' }}>
                    <div class="row" style={{backgroundColor:'#f2f2f2',marginLeft:'0px',marginRight:'0px'}}>
                        <div class="col-md-2" style={{paddingRight:'0px'}}><h5>Order Date :</h5></div>
                        <div class="col-md-2" style={{paddingLeft:'0px'}}><h5>{order.orderDate}</h5></div>
                        <div class="col-md-9">  </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8"><p style={{ fontSize: '20px', marginLeft: '10px', marginTop: '10px',marginBottom:'0px' }}>{order.buyerFirstName}  {order.buyerLastName}</p></div>
                        <div class="col-md-1"><button class="btn " id={order.orderId} style={{ backgroundColor: 'blue', color: 'white', fontSize: '16px', marginTop: '15px' }} onClick={this.trackOrder}> Order Details</button></div>
                        <div class="col-md-3"></div>
                    </div>
                    <div class="row"><p style={{marginLeft:'25px',fontSize: '15px',paddingBottom:'20px'}}>{order.buyerAddress}</p></div>
                    <div class="row" style={{ marginLeft: '5px' }}> {array2}</div>
                </div>)
            }


        })
        var items = []
        var sum=parseFloat(0);
        this.state.orderDetails.map((item) => {
            sum+=parseFloat(item.itemCostTotal)
            items.push(<div class="row" style={{ marginLeft: '30px',marginBottom:'20px',textAlign:'center' }}>
                <div class="col-md-2">{item.itemCount}</div>
                <div class="col-md-5">{item.itemName}</div>
                <div class="col-md-3"></div>
                <div class="col-md-2">${item.itemCostTotal}</div>
            </div>)
        })
        items.push(<br></br>)
        items.push(<hr style={{ borderBottom: "1px solid black" }}></hr>)
        items.push(<div class="row" style={{marginRight:'20px'}}>
            <div class="col-md-8"></div>
            <div class="col-md-3"><h4>Amount Paid :</h4></div>
            <div class="col-md-1"><h4>${sum.toFixed(2)}</h4></div>
        </div>)
        var progressBar = []
        switch (this.state.orderStatus) {
            case 'Delivered':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Ready</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Delivered</div>)

                break;
            case 'Cancelled':
                        progressBar.push(<div class="progress-bar" style={{ width: "100%", backgroundColor: "red" }}>Order Cancelled</div>)
        
                        break;
        }

        return (

            <div>
                {redirectVar}
                <p style={{ color: 'blue', fontWeight: '900', fontSize: '25px', marginLeft: '100px', marginTop: '50px' }}>Past Orders</p>
                <ul class="list-group" style={{ marginLeft: '150px', marginRight: '450px', marginTop: '50px' }}>
                    {array}

                </ul>
                <div class="modal" id="TrackOrder" >
                    <div class="modal-dialog" style={{ width: '850px', height: '1850px' }}>
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h1 class="modal-title"> Order Details</h1></div>
                                    <div clas="col-md-1"></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalClose}>&times;</button></div>
                                </div>
                            </div>
                            <div class="modal-body" style={{height:'200%'}}>
                                <div class="row" >
                                    <div class="col-md-2" style={{textAlign:'center',paddingRight:'0px'}}><h4>Order Date : </h4></div>
                                    <div class="col-md-3" style={{textAlign:'left',paddingLeft:'0px'}}><h4>{this.state.orderDate}</h4></div>
                                    <div class="col-md-7"></div>
                                </div>
                                <div class="row" style={{ marginBottom: '20px', textAlign: 'center' }}><h3>{this.state.buyerFirstName} {this.state.buyerLastName}</h3></div>
                                <div class="row" style={{ marginBottom: '20px', textAlign: 'center' }}>{this.state.buyerAddress} </div>
                                <div class="progress" style={{ marginBottom: '40px' }}>
                                    {progressBar}
                                </div>
                                <div class="row" style={{ marginLeft:'30px',marginBottom:'30px' ,fontSize:'16px',textAlign:'center',fontWeight:'bold'}}>
                                    <div class="col-md-2"><h4>Quantity</h4></div>
                                    <div class="col-md-5"><h4>Item Name</h4></div>
                                    <div class="col-md-3"></div>
                                    <div class="col-md-2"><h4>Cost</h4></div>
                                </div>
                                <div class="row">
                                    {items}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>




        )
    }
}

export default PastOrderOwner;