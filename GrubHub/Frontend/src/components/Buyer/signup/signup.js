import React, { Component } from 'react';
import '../../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {signupBuyerMutation} from '../../mutation/mutations'
import { withApollo } from 'react-apollo';

class signup extends Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            errorMessage: [],
            passwordError: "",
            authFlag: false,
            address: ""
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.signupHandler = this.signupHandler.bind(this);
        this.addressChangeHandler = this.addressChangeHandler.bind(this);
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
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        });
    }
    addressChangeHandler = (e) => {
        this.setState({
            address: e.target.value
        });
    }
    signupHandler = (e) => {
        this.props.client.mutate({
            mutation:signupBuyerMutation,
            variables:{
                firstName:this.state.firstName,
                lastName:this.state.lastName,
                email:this.state.email,
                address:this.state.address,
                password:this.state.password,
            }
        }).then((response)=>{
           if(response.data.signup.status === 200){
            cookie.save('cookie', 'admin', { path: '/' });
            sessionStorage.setItem("username",this.state.email)
            sessionStorage.setItem("FirstName",this.state.firstName)
            this.setState({
                authFlag: true,
                errorMessage: []
            })
           }else{
            this.setState({
                errorMessage: [response.data.signup.msg],
                authFlag: false
            })
           }
        })

    }
    render() {

        var redirectVar = "";
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/HomePage" />
        }
        let displayMessage = null;
        if (this.state.authFlag == false) {
            displayMessage = (this.state.errorMessage.map((error) => {
                return (<div class="li alert-danger">{error}</div>)
            }))
        }
        return (
            <div>
                {redirectVar}
                {displayMessage}
                <div class="backgroundImg">
                    <div class="container">
                        <div class="login-form">
                            <div class="main-div">
                                <div class="panel">
                                    <h2 class="heading"> Create your account</h2>
                                </div>
                                <div class="">
                                    <div class="row">
                                        <div class="col-md-6">First Name</div>
                                        <div class="col-md-6">Last Name</div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6"><input class="form-control" onChange={this.firstNameChangeHandler} type="text" name="firstName" /></div>
                                        <div class="col-md-6 "><input class="form-control" onChange={this.lastNameChangeHandler} type="text" name="lastName" /></div>
                                    </div>
                                    <br></br>
                                    <div class="row">
                                        <div class="col-md-12">   Email</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12"> <input onChange={this.emailChangeHandler} type="text" class="form-control email" name="email" /></div>
                                    </div>
                                    <br></br>
                                    <div class="row">
                                        <div class="col-md-12">  Password (8 characters minimum)</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12"> <input onChange={this.passwordChangeHandler} type="password" class="form-control email" name="password" /></div>
                                    </div>
                                    <br></br>
                                    <div class="row">
                                        <div class="col-md-12">Address</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <textarea row="3" onChange={this.addressChangeHandler} type="text" class="email" name="address"></textarea></div>
                                    </div>
                                </div>
                                <br></br>
                                <button onClick={this.signupHandler} class="btn btn-danger">Sign Up</button>
                                <br></br><br></br><br></br><br></br>
                                Have an account?
                            <a href="/login" class="">     Log In</a>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Home Component
export default withApollo(signup);