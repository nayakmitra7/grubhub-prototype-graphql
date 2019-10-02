import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import ImageUploader from 'react-images-upload';
import Axios from 'axios';



class UpdateDetailsOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            pictures: [],
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
        var data = ""
        console.log(sessionStorage.getItem("username"))
        Axios.get('http://localhost:3001/DetailsOwner/' + sessionStorage.getItem("username"))
            .then(response => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        firstName: response.data.ownerFirstName,
                        lastName: response.data.ownerLastName,
                        email: response.data.ownerEmail,
                        phone: response.data.ownerPhone,
                        image: response.data.ownerImage,
                        ownerId: response.data.ownerId,
                        restaurantId: response.data.restaurantId
                    })
                    console.log(response);

                } else if (response.status === 201) {
                    this.setState({
                        errorFlag: "Some error",
                        errorMessage: response.data
                    })
                }
            }).then(() => {
                if (this.state.restaurantId) {
                    data = this.state.restaurantId;
                    axios.get('http://localhost:3001/DetailsRestaurant/' + data).then((responses) => {
                        this.setState({
                            restaurantName: responses.data.restaurantName,
                            restaurantCuisine: responses.data.restaurantCuisine,
                            restaurantAddress: responses.data.restaurantAddress,
                            restaurantZipCode: responses.data.restaurantZipCode
                        })
                    })
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
        const data = { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, phone: this.state.phone, ownerId: this.state.ownerId, restaurantId: this.state.restaurantId, restaurantName: this.state.restaurantName, restaurantAddress: this.state.restaurantAddress, restaurantCuisine: this.state.restaurantCuisine, restaurantZipCode: this.state.restaurantZipCode };

        return new Promise((resolve, reject) => {
            Axios.post('http://localhost:3001/UpdateOwner', data)
                .then(response => {
                    if (response.status === 201) {
                        console.log(response.data);
                        this.setState({
                            errorFlag: "Some error",
                            errorMessage: response.data
                        })
                        reject();
                    }
                    else if (response.status === 200) {
                        resolve();
                    }
                })
        })
    }
    updateHandler = (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        var restData = { restaurantId: this.state.restaurantId, restaurantName: this.state.restaurantName, restaurantAddress: this.state.restaurantAddress, restaurantCuisine: this.state.restaurantCuisine, restaurantZipCode: this.state.restaurantZipCode }

        if (this.state.readOnly == false) {
            this.promise1().then(() => {
                Axios.post('http://localhost:3001/UpdateRestaurant', restData)
                    .then(response => {
                        sessionStorage.setItem("OwnerFirstName",this.state.firstName)

                        sessionStorage.setItem("RestaurantName",this.state.restaurantName)
                        if (response.status === 200) {
                            this.setState({
                                errorFlag: "Success",
                                readOnly: true
                            })
                            setTimeout(() => {
                                window.location.reload();
                               }, 500);

                        }
                        else if (response.status === 201) {
                            console.log(response.data);
                            this.setState({
                                errorFlag: "Some error",
                                errorMessage: response.data,
                            })
                        }
                    });

            })

        }
    }
    render() {
        let redirectVar = "";

        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/LoginOwner" />
        }
        let messageDisplay = "";
        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }

        let createDisplay = (
            <div>
                <div>
                    <table class="updateTable">
                        <div class="form-group" >
                            <br></br><br></br>
                            <tr>
                                <a href="#" onClick={this.readOnlyHandler} class="btn btn-info btn-sm">
                                    <span class="glyphicon glyphicon-edit"></span> Edit
        </a>
                            </tr>
                            <br></br><br></br>
                            <tr>
                                <td class="">First Name </td>
                                <td class="">Last Name</td>
                            </tr>
                            <tr>
                                <td class="signup"><input value={this.state.firstName} onChange={this.firstNameChangeHandler} type="text" class="form-control" name="firstName" readOnly={this.state.readOnly} /></td>
                                <td class="signup"><input value={this.state.lastName} onChange={this.lastNameChangeHandler} type="text" class="form-control" name="lastName" readOnly={this.state.readOnly} /></td>
                            </tr>
                            <br></br>
                            <tr>Email</tr>
                            <tr>
                                <input onChange={this.emailChangeHandler} value={this.state.email} type="text" class="form-control email" name="email" readOnly={this.state.readOnly} />
                            </tr>
                            <br></br>
                            <tr>Phone</tr>
                            <tr>
                                <input onChange={this.phoneChangeHandler} value={this.state.phone} type="text" class="form-control email" name="phone" readOnly={this.state.readOnly} />
                            </tr><br></br>
                            <tr>Restaurant Name</tr>
                            <tr>
                                <input onChange={this.restaurantNameChangeHandler} value={this.state.restaurantName} type="text" class="form-control email" name="restaurantName" readOnly={this.state.readOnly} />
                            </tr><br></br>
                            <tr>Cuisine</tr>
                            <tr>
                                <input onChange={this.restaurantCuisineChangeHandler} value={this.state.restaurantCuisine} type="text" class="form-control email" name="restaurantCuisine" readOnly={this.state.readOnly} />
                            </tr>
                            <br></br>
                            <tr>Restaurant Address</tr>
                            <tr>
                                <input onChange={this.restaurantAddressChangeHandler} value={this.state.restaurantAddress} type="text" class="form-control email" name="restaurantAddress" readOnly={this.state.readOnly} />
                            </tr>
                            <br></br>
                            <tr>Restaurant Zip</tr>
                            <tr>
                                <input onChange={this.restaurantZipCodeChangeHandler} value={this.state.restaurantZipCode} type="number" class="form-control email" name="restaurantZipCode" readOnly={this.state.readOnly} />
                            </tr>
                        </div>
                        <br></br><br></br>
                        <tr><button type="button" onClick={this.updateHandler} class="btn btn-success btn-lg col-md-6">Update</button></tr>
                    </table>
                    <br></br>
                    <br></br>

                    {messageDisplay}
                </div>

            </div>

        )

        return (
            <div>
                {redirectVar}
                <div class="col-md-3"></div>
                <div class="col-sm-3">{createDisplay}</div>
            </div>
        )
    }
}

export default UpdateDetailsOwner;