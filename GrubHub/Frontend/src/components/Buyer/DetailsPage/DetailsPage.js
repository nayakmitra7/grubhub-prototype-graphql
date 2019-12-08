import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {address} from '../../../constant'
import { fetchItemQuery,fetchSectionQuery } from '../../queries/queries'
import { withApollo } from 'react-apollo';

class DetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSearched: "",
            searchFlag: false,
            sectionName: "",
            sectionId: "",
            sectionDesc: "",
            messageFlag: false,
            restaurantId: sessionStorage.getItem("RestaurantID"),
            restaurantName: sessionStorage.getItem("RestaurantName"),
            sectionsPresent: [],
            itemName: "",
            itemDesc: "",
            itemPrice: "",
            itemSection: "",
            itemId: "",
            count: JSON.parse(localStorage.getItem(sessionStorage.getItem("username"))) ? JSON.parse(localStorage.getItem(sessionStorage.getItem("username"))).length : 0,
            itemCount: 1,
            itemCostTotal: 0,
            bag: localStorage.getItem(sessionStorage.getItem("username")) ? JSON.parse(localStorage.getItem(sessionStorage.getItem("username"))) : [],
            itemsPresent: [],
            checkoutFlag: false
        }
        this.itemSearchedChangeHandler = this.itemSearchedChangeHandler.bind(this);

    }
   
    
    serachFood = () => {
        if (this.state.itemSearched.length) {
            this.setState({ searchFlag: true })
            sessionStorage.setItem("ItemSearched", this.state.itemSearched);
        }
    }
    itemSearchedChangeHandler = (e) => {
        this.setState({ itemSearched: e.target.value })
    }
   
    promiseGetSections = () => {
        return new Promise((resolve, reject) => {
            this.props.client.query({
                query: fetchSectionQuery,
                variables: {
                    restaurantId: parseInt(this.state.restaurantId) 
                }
            }).then((response)=>{
                this.setState({
                    sectionsPresent: response.data.section
                })
            })
        })
    }
    promiseGetItems = () => {
        return new Promise((resolve, reject) => {
            this.props.client.query({
                query: fetchItemQuery,
                variables: {
                    restaurantId: parseInt(this.state.restaurantId) 
                }
            }).then((response)=>{
                this.setState({
                    itemsPresent: response.data.item
                })
            })
        })
    }

    
    componentDidMount() {

        this.promiseGetSections();
        this.promiseGetItems();

    }



    render() {
        var redirectVar = "";
        var array = [];
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
       
        if (this.state.searchFlag == true) {
            this.setState({ searchFlag: false })
            if (this.state.itemSearched.length) {
                redirectVar = <Redirect to="/SearchPage" />
            }
        }
        
        var array = [];
        if (this.state.sectionsPresent.length) {
            array.push(<div class="row" style={{ fontSize: "30px", fontWeight: "900" }}>
                <div class="col-md-4"></div>
                <div class="col-md-6"> {this.state.restaurantName}</div>
                <div class="col-md-2"></div>

            </div>)
            this.state.sectionsPresent.map((section) => {
                var flag = 0;
                array.push(<div>
                    <div class="row" style={{ fontSize: "20px", fontWeight: "900" }}>
                        <div class="col-md-11" style={{ alignItems: "center" }}>{section.menuSectionName} </div>
                    </div>
                    <br></br>
                </div>)
                this.state.itemsPresent.filter((item) => {

                    if (item.SectionId == section.menuSectionId) {
                        flag = 1;
                        array.push(
                            <div class="row embossed-heavy" style={{ marginBottom: '15px', borderStyle: "groove", paddingTop: '5px', paddingBottom: '5px', paddingRight: '0px', marginRight: '0px', backgroundColor: 'white' }}>
                                <span class="border border-dark" style={{ marginLeft: '10px' }}>
                                <div class="col-md-4" style={{ textAlign: "left" }}>
                                        <img style={{ width: "70%", paddingBottom: "10px",paddingTop:"10px" }} src={item.itemImage} class="rounded" />
                                    </div>
                                    <div class="col-md-4">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue", marginLeft: "10px", marginTop: "0px" }}>
                                            <p onClick={this.addItemModal} id={item.ItemId}>{item.ItemName}</p></div>
                                        <div class="row" style={{ marginLeft: "10px", marginBottom: "10px" }}>{item.ItemDesc}</div>
                                    </div>
                                    <div class="col-md-1"></div>
                                    <div class="col-md-2">
                                        <div class="row"style={{ textAlign: "right" }} ><p style={{ color: 'red' }}>${item.ItemPrice}</p></div>
                                    </div>
                                   


                                </span></div>)
                    }
                })
                if (flag == 0) {
                    array.pop()
                }
            })
        }
        return (
            <div>
                {redirectVar}
                <div class="row" style={{ backgroundColor: "white" }}>

                    <div class="col-md-6" style={{ marginTop: '20px', paddingLeft: '25px' }}>
                        <div class="col-md-6 "><input onChange={this.itemSearchedChangeHandler} style={{ height: '45px' }} class="col-md-12" type="text" placeholder="  What are you looking for?"></input></div>
                        <div class="col-md-2"><button class="btn btn-info btn-lg" onClick={this.serachFood} >Find Food</button></div>
                        <div class="col-md-1"></div>
                    </div>
                    <div class="col-md-6">
                        <div class="col-md-11"></div>
                        <div class="col-md-1" style={{ backgroundColor: "white", fontSize: '50px', color: '#000000', paddingLeft: '0px', paddingRight: '0px', }}><span onClick={this.openShoppingCart} class="glyphicon glyphicon-shopping-cart"><i class="fa-stack fa-2x has-badge" data-count={this.state.count}></i></span> </div>

                    </div>
                </div>
                <div class="row" >
                    <div class="col-md-11"> <p align="center" > </p></div>

                </div>

                <br></br>
                <div class="row ">
                    <div class="col-md-2" style={{ marginTop: '0px', paddingLeft: '20px', paddingRight: '0px' }}>
                    </div>
                    <div class="col-md-5">
                        {array}
                    </div>
                    <div class="col-md-4"></div>
                </div>

                <div class="row">
                    <div class="col-sm-5"></div>
                    <div class="col-sm-5" style={{ marginTop: '0px' }}></div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default withApollo(DetailsPage);