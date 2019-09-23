import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Sidebar from '../sidebar/sidebar';
import App from '../../App'
import ReactDOM from 'react-dom';


class DetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

            
            sectionName: "",
            sectionId: "",
            sectionDesc: "",
            errorFlag: "",
            restaurantId: sessionStorage.getItem("RestaurantID"),
            sectionsPresent: [],
            itemName: "",
            itemDesc: "",
            itemPrice: "",
            itemSection: "",
            itemId: "",
            itemsPresent: [],
            errorMessage: []
        }
  


    }

    promiseGetSections = () => {
        return new Promise((resolve, reject) => {

            axios.get('http://localhost:3001/section/' + this.state.restaurantId)
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

            axios.get('http://localhost:3001/items/' + this.state.restaurantId)
                .then(response => {
                    console.log("Status Code ss: ", response.data);
                    if (response.status === 200) {
                        this.setState({
                            itemsPresent: response.data
                        })
                        resolve();
                    }
                })

        })
    }
    
    addItemModal=()=>{
        document.getElementById("modalAddSection").style.display="block";

    }
    modalCloseSection=()=>{
        document.getElementById("modalAddSection").style.display="none"
    }
    componentDidMount() {
        
            this.promiseGetSections();
            this.promiseGetItems();
        
    }
    
   
   
    render() {
        var redirectVar = "";
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        var array = [];
        if (this.state.sectionsPresent.length) {
            this.state.sectionsPresent.map((section) => {
                var flag = 0;
                array.push(<div>
                    <div class="row" style={{ fontSize: "20px", fontWeight: "900" }}>
                        <div class="col-md-11" style={{ alignItems: "right" }}>{section.menuSectionName} </div>
                    </div>
                    <br></br>
                </div>)
                this.state.itemsPresent.filter((item) => {

                    if (item.SectionId == section.menuSectionId) {
                        flag = 1;
                        array.push(
                            <div class="row" style={{ marginBottom: '25px', borderStyle: "groove", paddingTop: '10px', paddingBottom: '10px' }}>
                                <span class="border border-dark">
                                    
                                    <div class="col-md-5">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue" }}>
                                            <p onClick={this.addItemModal} id={item.ItemId}>{item.ItemName}</p></div>
                                        <div class="row">{item.ItemDesc}</div>
                                    </div>
                                    <div class="col-md-6"></div>
                                    <div class="col-md-1">
                                        <div class="row">${item.ItemPrice}</div>
                                    </div>

                                    <br></br>
                                </span><br></br></div>)
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
                <div class="row">
                    <div class="col-md-12"> <p align="center" style={{ backgroundColor: "#d9d9d9", fontSize: '50px', color: '#000000', paddingLeft: '20px', paddingRight: '20px', }}>Details Page</p></div>
                </div>

                <br></br>
                <div class="row ">
                    <div class="col-md-2" style={{ marginTop: '0px', paddingLeft: '20px', paddingRight: '0px' }}>
                     
                    </div>
                    <div class="col-md-6">
                        {array}
                    </div>
                    <div class="col-md-4"></div>
                </div>

                <div class="row">
                    <div class="col-sm-5"></div>
                    <div class="col-sm-5" style={{ marginTop: '0px' }}></div>
                </div>
                <div class="modal" id="modalAddSection" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{this.itemName}</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseSection}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body">
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Sections
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input onChange={this.sectionNameChangeHandler} type="text" class="form-control signup" name="sectionName" value={this.state.sectionName} />
                                    </div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Description
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input onChange={this.sectionDescChangeHandler} type="text" class="form-control" name="sectionDesc" value={this.state.sectionDesc} />                                </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                
                                <div class="row">

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