import React, {Component} from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import ImageUploader from 'react-images-upload';
import Axios from 'axios';


class UpdateDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName : "",
            lastName : "",
            email : "",
            pictures:[],
            phone:"",
            errorMessage :[],
            authFlag : true,
            readOnly:true,
            ID:"",
            errorFlag:"No update"
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.readOnlyHandler = this.readOnlyHandler.bind(this);
    }
   
      
    componentDidMount(){
        var data = {username : sessionStorage.getItem("username")}
        Axios.post('http://localhost:3001/Details',data)
        .then(response => {
            
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                this.setState({
                    firstName:response.data.buyerFirstName,
                    lastName:response.data.buyerLastName,
                    email:response.data.buyerEmail,
                    phone:response.data.buyerPhone,
                    image:response.data.buyerImage,
                    ID:response.data.buyerID
                })
            }
            
            else if(response.status === 201){
                this.setState({
                    errorFlag:"Some error",
                    errorMessage : response.data
                })
            }
        });
    }

    firstNameChangeHandler = (e) => {
        this.setState({
            firstName : e.target.value
        })
    }
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName : e.target.value
        })
    } 
    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }
    phoneChangeHandler = (e) => {
        this.setState({
            phone : e.target.value
        })
    }
    readOnlyHandler =()=>{
        this.setState({
            readOnly:false
                })
    } 

    updateHandler = (e) =>{
    e.preventDefault();
    const data = { firstName: this.state.firstName, lastName : this.state.lastName , email :this.state.email, phone:this.state.phone,ID:this.state.ID};
    axios.defaults.withCredentials = true;

    if(this.state.readOnly==false){
        Axios.post('http://localhost:3001/updateBuyer',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                sessionStorage.setItem("username",this.state.username);
                this.setState({
                    errorFlag : "Success"
                })
                setTimeout(() => {
                    this.setState({
                        errorFlag: "No update"
                    });
                  }, 4000);
            }
            else if(response.status === 201){
                console.log(response.data);
                this.setState({
                    errorFlag : "Some error",
                    errorMessage : response.data
                })
            }
        });
    }
}

    render(){
        let redirectVar = null;
        console.log(!cookie.load('cookie'));
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        let messageDisplay="";
        if(this.state.errorFlag=="Some error"){
            messageDisplay = ( this.state.errorMessage.map( (error) =>{
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        }else if(this.state.errorFlag=="Success"){ 
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }

        let createDisplay = (
        <div>
        <table class="updateTable">
            <div class="form-group " >
            <br></br><br></br>
            <tr>
            <a href="#" onClick ={this.readOnlyHandler} class="btn btn-info btn-sm">
          <span class="glyphicon glyphicon-edit"></span> Edit
        </a>
            </tr>
            <br></br><br></br>
            <tr>
            <td class="">First Name </td>
            <td class="">Last Name</td>
            </tr>
            <tr>
            <td class="signup"><input value={this.state.firstName} onChange = {this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} /></td>
            <td class="signup"><input value={this.state.lastName} onChange = {this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly}/></td>
            </tr>
            <br></br>
            <tr>
                Email
            </tr>
            <tr>
            <input onChange = {this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly}/>
            </tr>
            <br></br>
            <tr>Phone</tr>
            <tr>
            <input onChange = {this.phoneChangeHandler} value={this.state.phone} type="text" class="form-control email" name="phone" readOnly={this.state.readOnly}/>
            </tr>
            </div>
            <br></br><br></br>
            <tr><button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Update</button></tr>
            </table>
            <br></br>
            <br></br>
      {messageDisplay}</div>
            )


        return(
            <div>
                {redirectVar}
            <div class="row" >
<div class="col-md-4"></div>

<div class="col-md-4">   {createDisplay}</div>
<div class="col-md-4"></div>

    

  


</div>

        </div>
        )
    }
}

export default UpdateDetails;