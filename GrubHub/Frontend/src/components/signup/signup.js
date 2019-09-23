import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class signup extends Component {
    constructor(){
        super();
        this.state = {  
            firstName : "",
            lastName : "",
            email : "",
            password : "",
            errorMessage :[],
            passwordError :"",
            authFlag:false
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.signupHandler = this.signupHandler.bind(this);
    }  
    firstNameChangeHandler =(e) =>{
        this.setState({
            firstName : e.target.value
        });

    }
    lastNameChangeHandler =(e) =>{
        this.setState({
            lastName : e.target.value
        });

    }  
    emailChangeHandler =(e) =>{
        this.setState({
            email : e.target.value
        });

    }  
    passwordChangeHandler =(e) =>{
        this.setState({
            password : e.target.value
        });
       

    }  
    signupHandler =(e) =>{
        e.preventDefault();
        axios.defaults.withCredentials = true;

        var data ={firstName:this.state.firstName, lastName:this.state.lastName, password:this.state.password, email:this.state.email}
       axios.post("http://localhost:3001/signup",data)
       .then((response)=>{
           if(response.status===200){
               this.setState({
                authFlag:true,
                errorMessage:[]
               })
               
           }else if(response.status===201) {
               this.setState({
                   errorMessage: response.data,
                   authFlag:false
               })
           }

       })

    }
    render(){

        var redirectVar="";
        if(cookie.load('cookie')){
           redirectVar = <Redirect to= "/UpdateDetails"/>
       }
        let displayMessage = null;
        if(this.state.authFlag==false){
            displayMessage = ( this.state.errorMessage.map( (error) =>{
                return (<ul class="li alert-danger">{error.msg}</ul>)
            }))
        }
        return(
            <div>
                {redirectVar}
                {displayMessage} 
                <div class = "backgroundImg">
            <div class="container">            
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2 class="heading"> Create your account</h2>
                        </div>
                        <table>
                            <div class="form-group">
                            <tr>
                            <td class="">First Name</td>
                            <td class="">Last Name</td>
                            </tr>
                            <tr>
                            <td class="signup"><input onChange = {this.firstNameChangeHandler} type="text" class="form-control" name="firstName" /></td>
                            <td class="signup"><input onChange = {this.lastNameChangeHandler} type="text" class="form-control" name="lastName" /></td>
                            </tr>
                            <br></br>
                            <tr>
                                Email
                            </tr>
                            <tr>
                            <input onChange = {this.emailChangeHandler} type="text" class="form-control email" name="email" />
                            </tr>
                            <br></br>
                            <tr>
                                Password (8 characters minimum)
                            </tr>
                            <tr>
                            <input onChange = {this.passwordChangeHandler} type="password" class="form-control email" name="password" />
                            </tr>
                            </div>
                            <br></br>
                            <button onClick = {this.signupHandler} class="btn btn-danger">Sign Up</button>                
                            <br></br><br></br><br></br><br></br>
                            Have an account?  
                            <a href="/login" class="">     Log In</a>
                            </table>

                    </div>
                    
                </div>
            </div>
            </div>
            </div>
        )
    }
}
//export Home Component
export default signup;