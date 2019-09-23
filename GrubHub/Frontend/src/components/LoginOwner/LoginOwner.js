import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class LoginOwner extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : "",
            password : "",
            authFlag : false,
            errorMessage : []
        }
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    submitLogin = (e) => {
        var headers = new Headers();
        e.preventDefault();
        const data = {
            username : this.state.username,
            password : this.state.password
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/loginOwner',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                sessionStorage.setItem("username",this.state.username);
                }
                else if(response.status === 201){
                    console.log(response.data);
                    this.setState({
                        authFlag : false,
                        errorMessage : response.data
                    })
                }
            });
    }

    render(){
      var redirectVar="";
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/HomeOwner"/>
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
            <div class="backgroundImgRest">
            <div class="container">            
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2 class="heading"> GRUBHUB for restaurants</h2>
                        </div>
                            <div class="form-group">
                                <p >Email</p>
                                <input onChange = {this.usernameChangeHandler} type="text" class="form-control" name="username" />
                            </div>
                            <div class="form-group">
                            <p>Password</p>
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" />
                            </div>
                            <br></br>
                            <button onClick = {this.submitLogin} class="btn btn-danger">Sign-In</button>                
                            <br></br><br></br><br></br><br></br>
                            <a href="/SignUpOwner" class="createAcc">Create your account</a>
                    </div>
                </div>
            </div>
            </div>
            </div>
        )
    }
}
//export Login Component
export default LoginOwner;