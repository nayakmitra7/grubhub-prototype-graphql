import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { address } from '../../../constant';


class SignUpOwner extends Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            errorMessage: [],
            passwordError: "",
            authFlag: false,
            zipCode: "",
            restaurant: ""
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.restaurantChangeHandler = this.restaurantChangeHandler.bind(this);
        this.zipCodeChangeHandler = this.zipCodeChangeHandler.bind(this);
        this.signupHandler = this.signupHandler.bind(this);
    }
    firstNameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value
        });

    }
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value
        });

    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        });

    }
    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value
        });
    }
    zipCodeChangeHandler = (e) => {
        this.setState({
            zipCode: e.target.value
        });
    }
    restaurantChangeHandler = (e) => {
        this.setState({
            restaurant: e.target.value
        });
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        });
    }
    signupHandler = (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;

        var data = { firstName: this.state.firstName, lastName: this.state.lastName, phone: this.state.phone, email: this.state.email, restaurant: this.state.restaurant, zipcode: this.state.zipCode, password: this.state.password }
        axios.post(address+"/SignUpOwner", data)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem("OwnerFirstName",this.state.firstName)
                    sessionStorage.setItem("username",this.state.email);
     
                    this.setState({
                        authFlag: true,
                        errorMessage: []
                    })
                } else if (response.status === 201) {
                    this.setState({
                        errorMessage: response.data,
                        authFlag: false
                    })
                }

            })

    }
    render() {

        var redirectVar = "";
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/SetUpOwner" />
        }
        let displayMessage = null;
        if (this.state.authFlag == false) {
            displayMessage = (this.state.errorMessage.map((error) => {
                return (<div class="li alert-danger">{error.msg}</div>)
            }))
        }
        return (
            <div class="backgroundImgRest">
                {redirectVar}
                <div class="container">
                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2 class="heading"> Create your account</h2>
                            </div>
                            <table>
                                <div class="form-group">
                                    <tr><td class="">First Name</td></tr>
                                    <tr><td class="signup"><input onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" /></td></tr>
                                    <br></br>
                                    <tr><td class="">Last Name</td></tr>
                                    <tr><td class="signup"><input onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" /></td></tr>
                                    <br></br>
                                    <tr> Email</tr>
                                    <tr><input onChange={this.emailChangeHandler} type="text" class="form-control email" name="email" /></tr>
                                    <br></br>

                                    <tr>Password</tr>
                                    <tr><input onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" /></tr>
                                    <br></br>
                                    <tr>Phone</tr>
                                    <tr><input onChange={this.phoneChangeHandler} type="number" class="form-control" name="phone" /></tr>
                                    <br></br>
                                    <tr>Restaurant Name</tr>
                                    <tr><input onChange={this.restaurantChangeHandler} type="text" class="form-control email" name="restaurant" /></tr>
                                    <br></br>
                                    <tr>Restaurant Zip Code</tr>
                                    <tr><input onChange={this.zipCodeChangeHandler} type="number" class="form-control" name="ZipCode" /></tr>
                                </div>
                                <br></br>
                                <button onClick={this.signupHandler} class="btn btn-danger">Sign Up</button>
                                <br></br><br></br>
                                Have an account?
                            <a href="/LoginOwner" class="">     Log In</a>
                            </table>

                        </div>
                       

                    </div>
                </div>
                <div class="row" style={{paddingBottom:'20px',paddingLeft:'30px'}}>{displayMessage}</div>
                
            </div>
        )
    }
}
//export Home Component
export default SignUpOwner;