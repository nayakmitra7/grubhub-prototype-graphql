import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {address} from '../../../constant'



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
        this.addItemModal = this.addItemModal.bind(this);
        this.incrementCount = this.incrementCount.bind(this);
        this.decrementCount = this.decrementCount.bind(this);
        this.addToBag = this.addToBag.bind(this);
        this.itemSearchedChangeHandler = this.itemSearchedChangeHandler.bind(this);

    }
    CheckOut = () => {
        this.setState({ checkoutFlag: true })
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        var CurrentDateTime = date + ' ' + time
        var data = { restaurantId: this.state.restaurantId, buyerID: sessionStorage.getItem("BuyerId"), buyerAddress: sessionStorage.getItem("Address"), orderStatus: "New", bag: localStorage.getItem(sessionStorage.getItem("username")), date: CurrentDateTime }
        axios.post(address+'/Order', data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({ bag: [] })
                    localStorage.removeItem(sessionStorage.getItem("username"))
                }
                else if (response.status === 201) {

                }
            });
    }
    openShoppingCart = () => {
        document.getElementById("shoppingCart").style.display = "block";
    }
    closeShoppingCart = () => {
        document.getElementById("shoppingCart").style.display = "none";

    }
    cancelBagAdd = () => {
        this.warningMessageClose();
        document.getElementById("modalAddItem").style.display = "none"
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
    emptyBag1 = () => {
        return new Promise((resolve, reject) => {
            document.getElementById("warningMessage").style.display = "none";
            this.setState({ bag: [], count: 0 });
            localStorage.setItem(sessionStorage.getItem("username"), JSON.stringify([]));
            resolve();
        })
    }
    emptyBag = () => {
        this.emptyBag1().then(() => {
            this.addToBag();
        })
    }
    checkIfSameRetaurant = (e) => {
        if (this.state.bag.length) {
            var item = this.state.bag[0];
            if (item.restaurantId == this.state.restaurantId) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 1;
        }
    }
    addToBag = () => {
        var item = { itemId: this.state.itemId, itemName: this.state.itemName, itemCostTotal: parseFloat(this.state.itemCostTotal), itemCount: this.state.itemCount, restaurantId: this.state.restaurantId }
        if (this.checkIfSameRetaurant()) {
            var itemPresent = false;
            this.state.bag.forEach((itemInBag) => {
                if (itemInBag.itemId == this.state.itemId) {
                    itemPresent = true;
                    itemInBag.itemCount += this.state.itemCount;
                    itemInBag.itemCostTotal = parseFloat(itemInBag.itemCostTotal) + parseFloat(this.state.itemCostTotal);
                }
            })
            this.setState({ messageFlag: true })
            if (itemPresent == false) {
                this.state.bag.push(item);
                var count1 = this.state.count;
                this.setState({ count: count1 + 1 })
            }
            this.setState({ itemCount: 1 });
            setTimeout(() => {
                document.getElementById("modalAddItem").style.display = "none"
                this.setState({ messageFlag: false })
            }, 1000);
            localStorage.setItem(sessionStorage.getItem("username"), JSON.stringify(this.state.bag));
        } else {
            document.getElementById("warningMessage").style.display = "block"
        }
    }
    warningMessageClose = () => {
        document.getElementById("warningMessage").style.display = "none";

    }
    decrementCount = (e) => {
        if (this.state.itemCount > 1) {
            var quantity = this.state.itemCount - 1;
            var cost = this.state.itemPrice;
            var costTotal = quantity * cost;
            this.setState({ itemCount: quantity, itemCostTotal: parseFloat(costTotal).toFixed(2) })

        }
    }
    incrementCount = (e) => {
        var quantity = this.state.itemCount + 1;
        var cost = this.state.itemPrice;
        var costTotal = quantity * cost;
        this.setState({ itemCount: quantity, itemCostTotal: parseFloat(costTotal).toFixed(2) })

    }

    promiseGetSections = () => {
        return new Promise((resolve, reject) => {

            axios.get(address+'/section/' + this.state.restaurantId)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            sectionsPresent: response.data
                        })
                        resolve();
                    }
                })

        })
    }
    promiseGetItems = () => {
        return new Promise((resolve, reject) => {

            axios.get(address+'/items/' + this.state.restaurantId)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            itemsPresent: response.data
                        })
                        resolve();
                    }
                })

        })
    }

    addItemModal = (e) => {

        document.getElementById("modalAddItem").style.display = "block";
        this.setState({ itemId: e.target.id })
        var item = this.state.itemsPresent.filter((i) => {
            if (i.ItemId == e.target.id) {
                return i;
            }
        })
        var quantity = this.state.itemCount;
        var cost = parseFloat(item[0].ItemPrice);
        var itemTotal = quantity * cost;
        this.setState({
            itemName: item[0].ItemName,
            itemDesc: item[0].ItemDesc,
            itemPrice: item[0].ItemPrice,
            itemCount: 1,
            itemCostTotal: parseFloat(itemTotal)
        })
    }
    modalCloseSection = () => {
        document.getElementById("modalAddItem").style.display = "none"
        this.setState({ itemCount: 1 })
    }
    deleteItem = (e) => {
        var val = this.state.bag.filter((bag) => {
            if (e.target.id != bag.itemId) {
                return bag;
            }
        })
        var len = val.length
        this.setState({ bag: val, count: len })
        localStorage.setItem(sessionStorage.getItem("username"), JSON.stringify(val));

    }
    componentDidMount() {

        this.promiseGetSections();
        this.promiseGetItems();

    }



    render() {
        var redirectVar = "";
        var bagDispay = ""
        var bagButtonDisplay = "";
        var array = [];
        var subTotal = parseFloat(0);
        if (this.state.bag.length) {
            array.push(<div class="row"><div class="col-md-12" style={{ textAlign: 'center', fontSize: '25px', marginBottom: '20px' }}>{this.state.restaurantName}</div> </div>)
            array.push(<div class="row" style={{ textAlign: 'center' }}>
                <div className="col-md-2" style={{ fontSize: "18px" }}><p>Quantity</p></div>
                <div className="col-md-4" style={{ fontSize: "18px" }}><p>Item Name</p></div>
                <div className="col-md-3"></div>
                <div className="col-md-3" style={{ fontSize: "18px" }}><p>Cost</p></div>
            </div>)

            this.state.bag.forEach((bag) => {
                subTotal += parseFloat(bag.itemCostTotal);
                array.push(<div class="row" style={{ textAlign: 'center' }}>
                    <div className="col-md-2"><p>{bag.itemCount}</p></div>
                    <div className="col-md-4"><p>{bag.itemName}</p></div>
                    <div className="col-md-3"><span id={bag.itemId} class="glyphicon glyphicon-trash" onClick={this.deleteItem}></span></div>
                    <div className="col-md-3"><p>${bag.itemCostTotal}</p></div>
                </div>)

            })
            subTotal = parseFloat(subTotal).toFixed(2);
            array.push(<hr style={{ borderBottom: "1px solid #fff" }}></hr>)
            array.push(<div class="row">
                <div class="col-md-7"></div>
                <div class="col-md-3" style={{ fontSize: '18px' }}>Sub Total : </div>
                <div class="col-md-1" style={{ fontSize: '18px' }}>${subTotal}</div>
                <div class="col-md-1"></div>
            </div>)
            bagDispay = array;
            bagButtonDisplay = (<div><input type="button" class="btn btn-success" value="Place Order" onClick={this.CheckOut} /></div>)
        } else {
            bagDispay = (<div class=" emptyBag" style={{ paddingTop: '250px', paddingBottom: '250px' }}></div>)
            bagButtonDisplay = ""
        }
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        if (this.state.checkoutFlag == true) {
            redirectVar = <Redirect to="/ReviewPage" />
        }
        if (this.state.searchFlag == true) {
            this.setState({ searchFlag: false })
            if (this.state.itemSearched.length) {
                redirectVar = <Redirect to="/SearchPage" />
            }
        }
        var messageDisplay = ""
        if (this.state.messageFlag == true) {
            messageDisplay = (<ul class="li alert alert-success">Added this to your bag !!!</ul>);
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
                <div class="modal" id="modalAddItem" >
                    <div class="modal-dialog" style={{ width: '850px', height: '1850px' }}>
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{this.state.itemName}</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseSection}>&times;</button></div>
                                </div>
                            </div>
                            <div class="modal-body">

                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Description
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <p>{this.state.itemDesc}</p>
                                    </div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Item Price
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        ${this.state.itemPrice}
                                    </div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        <p style={{ fontWeight: '900' }} >Quantity</p>
                                    </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <div class="col-md-1">   <input type='button' value='-' class='qtyminus btn-danger' field='quantity' onClick={this.decrementCount} /></div>
                                        <div class="col-md-1" style={{ paddingLeft: "0px", paddingRight: "0px" }}>   <input type='number' name='quantity' min="1" value={this.state.itemCount} class='qty' /></div>
                                        <div class="col-md-1" style={{ paddingLeft: "0px", paddingRight: "0px" }}>   <input type='button' value='+' class='qtyplus btn-success' field='quantity' onClick={this.incrementCount} /></div>
                                        <div class="col-md-9"></div>
                                    </div>

                                </div>
                            </div>

                            <div class="modal-footer">

                                <div class="row">
                                    <div class="col-md-2"></div>
                                    <div class="col-md-3"><button class="btn btn-success btn-lg" style={{ width: '300px' }} onClick={this.addToBag}>Add to bag : ${this.state.itemCostTotal}</button>
                                    </div>
                                    <div class="col-md-7"></div>
                                </div>
                                <div class="row">
                                    <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px", paddingTop: "25px" }}>
                                        {messageDisplay}

                                    </div>

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal" id="shoppingCart" >
                    <div class="modal-dialog" >
                        <div class="modal-content" >

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h4 class="modal-title">Shopping Cart</h4></div>
                                    <div class="col-md-2"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.closeShoppingCart}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body" style={{ height: "600px" }}>
                                {bagDispay}
                                <div><span class="border border-top-0 border-right-0 border-left-0"></span></div>

                            </div>

                            <div class="modal-footer">

                                <div class="row">
                                    {bagButtonDisplay}
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal" id="warningMessage" >
                    <div class="modal-dialog" >
                        <div class="modal-content" >

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-6"><h4 class="modal-title">Warning Message</h4></div>
                                    <div class="col-md-2"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.warningMessageClose}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body" style={{ fontWeight: "900" }}>
                                Adding this will delete all other items in the bag. Do you want to proceed?
                            </div>

                            <div class="modal-footer">

                                <div class="row">
                                    <div class="col-md-3"></div>
                                    <div class="col-md-3"><button class="btn btn-success btn-lg" onClick={this.emptyBag}>Yes,Please</button></div>
                                    <div class="col-md-3"><button class="btn btn-danger btn-lg" style={{ width: "150px" }} onClick={this.cancelBagAdd}>No, Thanks!</button></div>
                                    <div class="col-md-3"></div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
//export Login Component
export default DetailsPage;