import React, {Component} from 'react';
import '../../../App.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { withApollo } from 'react-apollo';
import { getOwner } from '../../queries/queries'
import { loginOwnerMutation } from '../../mutation/mutations';
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
    componentDidMount(){
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
    fetchDetails = (username)=>{
        this.props.client.query({
            query: getOwner,
            variables: {
                userId: username
            }
        }).then((response) => {
            if(response.data.Owner){
                sessionStorage.setItem("OwnerFirstName",response.data.Owner.ownerFirstName);
                sessionStorage.setItem("RestaurantId",response.data.Owner.restaurantId)
                sessionStorage.setItem("RestaurantName",response.data.Owner.restaurantName)
            }
        })
    }
    submitLogin = (e) => {
        e.preventDefault();
        const data = {
            username : this.state.username,
            password : this.state.password
        }
        this.props.client.mutate({
            mutation: loginOwnerMutation,
            variables: {
                email: this.state.username,
                password: this.state.password
            }
        }).then((response) => {
            if (response.data.loginOwner.status === 200) {
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
                    errorMessage: [response.data.loginOwner.msg]
                })
            }
        })
        
    }

    render(){
      var redirectVar="";
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/HomeOwner"/>
        }
        let displayMessage = null;
        if(this.state.authFlag==false){
            displayMessage = ( this.state.errorMessage.map( (error) =>{
                return (<ul class="li alert-danger">{error}</ul>)
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
export default withApollo(LoginOwner);