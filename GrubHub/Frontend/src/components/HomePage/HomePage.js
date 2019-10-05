
import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import {address} from '../../constant'



class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            itemSearched : "",
            searchFlag:false
           
        }
        this.itemSearchedChangeHandler = this.itemSearchedChangeHandler.bind(this);
       
    }
    componentDidMount=(e)=>{
        axios.get(address+'/Details/'+sessionStorage.getItem("username"))
        .then(response => {
            if(response.status === 200){
                sessionStorage.setItem("Address",response.data.buyerAddress);
                sessionStorage.setItem("FirstName",response.data.buyerFirstName);
                sessionStorage.setItem("BuyerId",response.data.buyerID)
                return Promise.resolve();
            }
          
        });
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
            this.setState({searchFlag:false})
            redirectVar= <Redirect to="/SearchPage" />
            
        }
        return (
            <div class="home">
                {redirectVar}
                
                <div class="row">
                    <div class="col-md-12"> <p align="center" style={{ backgroundColor: "white", fontSize: '50px', color: '#000000', paddingLeft: '20px', paddingRight: '20px', }}></p></div>
                </div>
                <div class="row " style={{ marginTop: '50px' }}>
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <div class="col-md-1"></div>
                        <div class="col-md-7 "><input onChange ={this.itemSearchedChangeHandler}style={{ height: '50px',width:'100%',fontSize:'20px' }} type="text" placeholder="What are you looking for?"></input></div>
                        <div class="col-md-4" style={{paddingBottom:"200px", }}><button class="btn btn-lg" style={{backgroundColor:"rgb(0, 112, 235)",color:"white"}} onClick ={this.serachFood} >Find Food</button></div>
                    </div>
                    <div class="col-md-3"></div>
                    <br></br>
                    <br></br>
                </div>

            </div>
        )
    }
}

export default HomePage;

