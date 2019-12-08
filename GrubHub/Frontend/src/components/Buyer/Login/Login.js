import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { withApollo } from 'react-apollo';
import { getBuyer } from '../../queries/queries'
import { loginBuyerMutation } from '../../mutation/mutations';



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            authFlag: false,
            errorMessage: []
        }
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.fetchDetails = this.fetchDetails.bind(this);
    }
    componentDidMount() {
        this.fetchDetails("nayakmitra7@gmail.com")
        this.setState({
            authFlag: false
        })
    }
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    fetchDetails = (username) => {
        this.props.client.query({
            query: getBuyer,
            variables: {
                userId: username
            }
        }).then((response) => {
            if(response.data.buyer){
                sessionStorage.setItem("Address", response.data.buyer.buyerAddress);
                sessionStorage.setItem("FirstName", response.data.buyer.buyerFirstName);
                sessionStorage.setItem("BuyerId", response.data.buyer.buyerID)
            }
      
        })
    }

    submitLogin = (e) => {
        e.preventDefault();
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        axios.defaults.withCredentials = true;
        this.props.client.mutate({
            mutation: loginBuyerMutation,
            variables: {
                email: this.state.username,
                password: this.state.password
            }
        }).then((response) => {
            if (response.data.login.status === 200) {
                this.fetchDetails(this.state.username)
                sessionStorage.setItem("username", this.state.username);
                cookie.save('cookie', 'admin', { path: '/' });
                this.setState({
                    authFlag: true
                })
            }
            else {
                this.setState({
                    authFlag: false,
                    errorMessage: [response.data.login.msg]
                })
            }
        })

    }

    render() {
        var redirectVar = "";
        if (this.state.authFlag) {
            redirectVar = <Redirect to="/HomePage" />
        }
        let displayMessage = null;
        if (this.state.authFlag == false) {
            displayMessage = (this.state.errorMessage.map((error) => {
                return (<li class="li alert-danger">{error}</li>)
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
                                    <h2 class="heading"> Sign in with your Grubhub account</h2>
                                </div>
                                <div class="form-group">
                                    <p >Email</p>
                                    <input onChange={this.usernameChangeHandler} type="text" class="form-control" name="username" />
                                </div>
                                <div class="form-group">
                                    <p>Password</p>
                                    <input onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" />
                                </div>
                                <br></br>
                                <button onClick={this.submitLogin} class="btn btn-danger">Sign-In</button>
                                <br></br><br></br><br></br><br></br>
                                <a href="/signup" class="createAcc">Create your account</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withApollo(Login);
