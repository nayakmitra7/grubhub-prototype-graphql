import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { address } from '../../constant';

class UpcomingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            orderStatus: "",
            restaurantName: "",
            buyerAddress: "",
            orderDate: "",
            orderDetails: []

        }

    }
    componentDidMount() {
        axios.get(address+'/UpcomingOrders/' + sessionStorage.getItem("BuyerId"))
            .then(response => {
                if (response.status === 200) {
                    this.setState({ orders: response.data })
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
            restaurantName: order[0].restaurantName,
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
            if (order.orderStatus != "Delivered" && order.orderStatus != "Cancelled" ) {
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
                    <div class="row">
                        <div class="col-md-8"><p style={{ fontSize: '20px', marginLeft: '10px', marginTop: '10px' }}>{order.restaurantName}</p></div>
                        <div class="col-md-1"><button class="btn " id={order.orderId} style={{ backgroundColor: 'blue', color: 'white', fontSize: '16px', marginTop: '15px' }} onClick={this.trackOrder}>Track Order</button></div>
                        <div class="col-md-3"></div>
                    </div>
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
                <div class="col-md-2">{item.itemCostTotal}</div>
            </div>)
        })
        sum=sum.toFixed(2);
        items.push(<br></br>)
        items.push(<hr style={{ borderBottom: "1px solid black" }}></hr>)
        items.push(<div class="row" style={{marginRight:'20px'}}>
            <div class="col-md-8"></div>
            <div class="col-md-3"><h4>Amount Paid :</h4></div>
            <div class="col-md-1"><h4>${sum}</h4></div>
        </div>)
        var progressBar = []
        switch (this.state.orderStatus) {
            case 'New':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                break;
            case 'Confirmed':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                break;
            case 'Preparing':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                break;
            case 'Ready':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Ready</div>)
                break;
            case 'Delivered':
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Placed</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Order Confirmed </div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Preparing</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Ready</div>)
                progressBar.push(<div class="progress-bar bg-danger" style={{ width: "20%" }}>Delivered</div>)

                break;
        }

        return (

            <div>
                {redirectVar}
                <p style={{ color: 'blue', fontWeight: '900', fontSize: '25px', marginLeft: '100px', marginTop: '50px' }}>Upcoming Orders</p>
                <ul class="list-group" style={{ marginLeft: '150px', marginRight: '450px', marginTop: '50px' }}>
                    {array}

                </ul>
                <div class="modal" id="TrackOrder" >
                    <div class="modal-dialog" style={{ width: '850px', height: '1850px' }}>
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h1 class="modal-title">Track Order</h1></div>
                                    <div clas="col-md-1"></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalClose}>&times;</button></div>
                                </div>
                            </div>
                            <div class="modal-body" style={{height:'200%'}}>
                                <div class="row" style={{ marginBottom: '20px', textAlign: 'center' }}><h3>{this.state.restaurantName}</h3></div>
                                <div class="progress" style={{ marginBottom: '90px' }}>
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

export default UpcomingOrder;