import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router';
import { address } from '../../../constant';
import '../../../App.css';
import { getBuyer } from '../../queries/queries'
import {updateBuyerMutation} from '../../mutation/mutations'

class UpdateDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: sessionStorage.getItem("username"),
            file: null,
            phone: "",
            filePreview: null,
            errorMessage: [],
            authFlag: true,
            readOnly: true,
            ID: "",
            errorFlag: "No update",
            address: "",
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.readOnlyHandler = this.readOnlyHandler.bind(this);
        this.pictureChangeHandler = this.pictureChangeHandler.bind(this)
        this.resetPicture = this.resetPicture.bind(this)

    }
    componentDidMount(){
        this.props.client.query({
            query: getBuyer,
            variables: {
                userId: this.state.email
            }
        }).then((response)=>{
            this.setState({
                firstName: response.data.buyer.buyerFirstName,
                lastName: response.data.buyer.buyerLastName,
                email: response.data.buyer.buyerEmail,
                phone: response.data.buyer.buyerPhone,
                image: response.data.buyer.buyerImage,
                ID: response.data.buyer.buyerID,
                address: response.data.buyer.buyerAddress
            })
        })
    }
   
    pictureChangeHandler(event) {
        if (event.target.files[0]) {
            this.setState({
                file: event.target.files[0],
                filePreview: URL.createObjectURL(event.target.files[0])
            });
        }

    }
    resetPicture(event) {
        event.preventDefault();
        this.setState({ file: null });
    }
    firstNameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value
        })
    }
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value
        })
    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value
        })
    }
    readOnlyHandler = () => {
        this.setState({
            readOnly: false
        })
    }
    addressChangeHandler = (e) => {
        this.setState({
            address: e.target.value
        })
    }

    updateHandler = (e) => {
        e.preventDefault();
        const data = { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, phone: this.state.phone, ID: this.state.ID, address: this.state.address };
        axios.defaults.withCredentials = true;

        if (this.state.readOnly == false && this.state.firstName.length && this.state.lastName.length && this.state.email.length && this.state.address.length && this.state.phone.length==10) {
            this.props.client.mutate({
                mutation:updateBuyerMutation,
                variables:{
                    firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    email:this.state.email,
                    address:this.state.address,
                    phone:this.state.phone,
                    ID:this.state.ID

                }
            }).then((response)=>{
               if(response.data.update.status === 200){
                sessionStorage.setItem("FirstName", this.state.firstName)
                var bag = localStorage.getItem(sessionStorage.getItem("username")) ? JSON.parse(localStorage.getItem(sessionStorage.getItem("username"))) : []
                sessionStorage.setItem("username", this.state.email);
                localStorage.setItem(sessionStorage.getItem("username"), JSON.stringify(bag));

                this.setState({
                    errorFlag: "Success"
                })

                setTimeout(() => {
                    window.location.reload();
                }, 500);

               }else{
                this.setState({
                    errorFlag: "Some error",
                    errorMessage: [response.data.update.msg]
                })
               }
            })
        }
    }

    render() {
        let redirectVar = null;
        let image = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-circle" /></div>
        let uploadImage = ""
         if (!cookie.load('cookie')) {
             redirectVar = <Redirect to="/login" />
         }
        let messageDisplay = "";
        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }

      
        let createDisplay = (
            <div>

                <div class="row" style={{ paddingBottom: '50px', paddingTop: '50px' }}>
                    <a href="#" onClick={this.readOnlyHandler} class="btn btn-info btn-sm">
                        <span class="glyphicon glyphicon-edit"></span> Edit</a>
                </div>
                <div class="row" style={{ paddingBottom: '10px' }}>
                    <div class="col-md-6" style={{ paddingLeft: '50px' }}>
                        <div class="col-md-6">{uploadImage}</div>
                        {image}
                    </div>
                </div>
                <div class="row" style={{ paddingBottom: '0px' }}>
                    <div class="row" style={{ paddingBottom: '10px' }}>
                        <div class="col-md-4 signup">First Name</div>
                        <div class="col-md-4 signup">Last Name</div>
                    </div>
                    <div class="row" style={{ paddingBottom: '10px' }}>
                        <div class="col-md-4 signup">
                            <input value={this.state.firstName} onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} />
                        </div>
                        <div class="col-md-4 signup"><input value={this.state.lastName} onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly} /></div>
                    </div>
                </div>
                <div class="row" style={{ paddingBottom: '10px' }}>
                    <div class="col-md-6">
                        <div class="row" style={{ paddingBottom: '10px' }}>Email</div>
                        <div class="row" style={{ paddingBottom: '10px' }}><input onChange={this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly} /></div>
                        <div class="row" style={{ paddingBottom: '10px' }}>Phone</div>
                        <div class="row" style={{ paddingBottom: '10px' }}><input onChange={this.phoneChangeHandler} value={this.state.phone} type="text" class="form-control email" name="phone" readOnly={this.state.readOnly} />
                        </div>
                        <div class="row" style={{ paddingBottom: '10px' }}>Address</div>
                        <div class="row" style={{ paddingBottom: '10px' }}><input onChange={this.addressChangeHandler} value={this.state.address} type="text" class="form-control email" name="address" readOnly={this.state.readOnly} /></div>
                    </div>

                </div>
                <div class="row"><button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Update</button></div>
            </div>
        )


        return (
            <div>
                
                {redirectVar}
                <div class="row" >
                    <div class="col-md-4"></div>

                    <div class="col-md-8">   {createDisplay}</div>
                </div>
                <div class="row" style={{ paddingLeft: '30px', marginTop: '5px', textAlign: 'center' }}> {messageDisplay}</div>

            </div>
        )
    }
}
export default withApollo(UpdateDetails);
