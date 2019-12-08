import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { withApollo } from 'react-apollo';
import '../../../App.css';
import { getOwner,fetchRestaurantQuery } from '../../queries/queries'
import { updateOwnerMutation,updateRestaurantMutation } from '../../mutation/mutations';


class UpdateDetailsOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            errorMessage: [],
            authFlag: true,
            readOnly: true,
            ownerId: "",
            restaurantId: "",
            restaurantName: "",
            restaurantCuisine: "",
            restaurantAddress: "",
            restaurantZipCode: "",
            errorFlag: "No update"
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.readOnlyHandler = this.readOnlyHandler.bind(this);
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this);
        this.restaurantCuisineChangeHandler = this.restaurantCuisineChangeHandler.bind(this);
        this.restaurantAddressChangeHandler = this.restaurantAddressChangeHandler.bind(this);
        this.restaurantZipCodeChangeHandler = this.restaurantZipCodeChangeHandler.bind(this);


    }


    componentDidMount() {
        this.props.client.query({
            query: getOwner,
            variables: {
                userId: sessionStorage.getItem("username")
            }
        }).then((response) => {
            if(response.data.Owner){
                this.setState({
                    firstName: response.data.Owner.ownerFirstName,
                    lastName: response.data.Owner.ownerLastName,
                    email: response.data.Owner.ownerEmail,
                    phone: response.data.Owner.ownerPhone,
                    ownerId: response.data.Owner.ownerId,
                    restaurantId: response.data.Owner.restaurantId
                })
                if (response.data.Owner.restaurantId) {
                    this.props.client.query({
                        query:fetchRestaurantQuery,
                        variables:{restaurantId:parseInt(response.data.Owner.restaurantId)}
                    }).then((responses)=>{
                        this.setState({
                            restaurantName: responses.data.restaurant.restaurantName,
                            restaurantCuisine: responses.data.restaurant.restaurantCuisine != null ? responses.data.restaurant.restaurantCuisine : "",
                            restaurantAddress: responses.data.restaurant.restaurantAddress,
                            restaurantZipCode: responses.data.restaurant.restaurantZipCode
                        })
                    })
                }
            }
            
        })
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
    restaurantNameChangeHandler = (e) => {
        this.setState({
            restaurantName: e.target.value
        })
    }
    restaurantCuisineChangeHandler = (e) => {
        this.setState({
            restaurantCuisine: e.target.value
        })
    }
    restaurantAddressChangeHandler = (e) => {
        this.setState({
            restaurantAddress: e.target.value
        })
    }
    restaurantZipCodeChangeHandler = (e) => {
        this.setState({
            restaurantZipCode: e.target.value
        })
    }

    promise1 = () => {
        return new Promise((resolve, reject) => {
            this.props.client.mutate({
                mutation:updateOwnerMutation,
                variables:{
                    firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    email:this.state.email,
                    phone:this.state.phone,
                    ownerId:this.state.ownerId

                }
            }).then(()=>{
                resolve();
            })
        })
    }
    updateHandler = (e) => {
        e.preventDefault();
        if (this.state.readOnly == false) {
            this.promise1().then(() => {
                this.props.client.mutate({
                    mutation:updateRestaurantMutation,
                    variables:{
                        restaurantId:this.state.restaurantId,
                        restaurantName:this.state.restaurantName,
                        restaurantAddress:this.state.restaurantAddress,
                        restaurantCuisine:this.state.restaurantCuisine,
                        restaurantZipCode:parseInt(this.state.restaurantZipCode) 
    
                    }
                }).then(()=>{
                    sessionStorage.setItem("OwnerFirstName", this.state.firstName)
                    sessionStorage.setItem("RestaurantName", this.state.restaurantName)
                    this.setState({
                        errorFlag: "Success",
                        readOnly: true
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                })

            })

        }
    }
    render() {
        let redirectVar = "";
        let image = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-thumbnail" /></div>
        let uploadImage = "";
        let image2 = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-thumbnail" /></div>
        let uploadImage2 = ""
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/LoginOwner" />
        }
        let messageDisplay = "";
        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success" style={{textAlign:"center"}}>Successfully Updated !!!</ul>);
        }
        if (this.state.filePreview) {
            image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview} class="img-thumbnail" onChange={this.pictureChangeHandler} /></div>
            uploadImage = <button onClick={this.uploadImageHandler}>Upload Image</button>

        } else if (this.state.file) {
            image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.file} class="img-thumbnail" onChange={this.pictureChangeHandler} /></div>
        }

        if (this.state.filePreview2) {
            image2 = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview2} class="img-thumbnail" onChange={this.pictureChangeHandler2} /></div>
            uploadImage2 = <button onClick={this.uploadImageHandler2}>Upload Image</button>

        } else if (this.state.file2) {
            image2 = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.file2} class="img-thumbnail" onChange={this.pictureChangeHandler2} /></div>
        }
        let createDisplay = (
            <div>
                <div>
                <div class="row" style={{ paddingLeft: '250px' }}> <p><h2>Personal Information</h2></p></div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">First Name</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-6"><input value={this.state.firstName} onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Last Name</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-6"><input value={this.state.lastName} onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly} /></div>
                            </div>

                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Email</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly} /></div>
                            </div>

                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6">{uploadImage}</div>
                            </div>
                            <div class="row"><div class="col-md-8">{image}</div></div>
                            
                        </div>
                    </div>
                    <div class="row" style={{ paddingTop: 'px' }}>
                    <div class="row" style={{ paddingLeft: '250px' }}> <p><h2>Restaurant Information</h2></p></div>

                        <div class="col-md-6">
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Phone Number</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.phoneChangeHandler} value={this.state.phone} type="text" class="form-control email" name="phone" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Name</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantNameChangeHandler} value={this.state.restaurantName} type="text" class="form-control email" name="restaurantName" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Cuisine</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantCuisineChangeHandler} value={this.state.restaurantCuisine} type="text" class="form-control email" name="restaurantCuisine" readOnly={this.state.readOnly} /></div>
                            </div>

                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Address</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantAddressChangeHandler} value={this.state.restaurantAddress} type="text" class="form-control email" name="restaurantAddress" readOnly={this.state.readOnly} /></div>
                            </div>
                            <div class="row" style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                <div class="col-md-12">Restaurant Zip</div>
                            </div>
                            <div class="row" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                                <div class="col-md-12"><input onChange={this.restaurantZipCodeChangeHandler} value={this.state.restaurantZipCode} type="number" class="form-control email" name="restaurantZipCode" readOnly={this.state.readOnly} /></div>
                            </div>

                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6">{uploadImage2}</div>
                            </div>
                            <div class="row"><div class="col-md-8">{image2}</div>
                            </div>

                        </div>
                    </div>
                    <div class="row" style={{ paddingTop: '20px' }}>
                        <button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Update</button>
                    </div>


                </div>
                
            </div>

        )

        return (
            <div>
                {redirectVar}
                <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-1"><div class="row" style={{ paddingBottom: '40px', paddingTop: '20px' }}>
                        <a href="#" onClick={this.readOnlyHandler} class="btn btn-info btn-sm">
                            <span class="glyphicon glyphicon-edit"></span> Edit </a>
                    </div></div>
                <div class="col-md-9">{createDisplay}</div></div>
               <div class="row" style={{paddingLeft:'40px',marginTop:'5px'}}>{messageDisplay}</div>

            </div>
        )
    }
}

export default withApollo(UpdateDetailsOwner);