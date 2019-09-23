
import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import ImageUploader from 'react-images-upload';
import Axios from 'axios';


class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            itemSearched : "",
            searchFlag:false
           
        }
        this.itemSearchedChangeHandler = this.itemSearchedChangeHandler.bind(this);
       
    }
    itemSearchedChangeHandler=(e)=>{
        this.setState({itemSearched:e.target.value,searchFlag:false})
    }
    serachFood=()=>{
        if(this.state.itemSearched.length){
            this.setState({searchFlag:true})
        sessionStorage.setItem("ItemSearched",this.state.itemSearched);
        }
        
        
    }
    render() {
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        if(this.state.searchFlag==true){
            redirectVar= <Redirect to="/SearchPage" />
        }
        return (
            <div>
                {redirectVar}
                <div class="row">
                    <div class="col-md-12"> <p align="center" style={{ backgroundColor: "#d9d9d9", fontSize: '50px', color: '#000000', paddingLeft: '20px', paddingRight: '20px', }}>HomePage</p></div>
                </div>
                <div class="row" style={{ marginTop: '50px' }}>
                    <div class="col-md-3"></div>
                    <div class="col-md-5">
                        <div class="col-md-2"></div>
                        <div class="col-md-6 "><input onChange ={this.itemSearchedChangeHandler}style={{ height: '50px' }} class="col-md-12" type="text" placeholder="What are you looking for?"></input></div>
                        <div class="col-md-4"><button class="btn btn-info btn-lg" onClick ={this.serachFood} >Find Food</button></div>
                    </div>
                    <div class="col-md-4"></div>
                </div>

            </div>
        )
    }
}

export default HomePage;

