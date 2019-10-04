import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import ImageUploader from 'react-images-upload';
import Axios from 'axios';
import { address } from '../../constant';


class UpdateDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            file: null,
            phone: "",
            filePreview: null,
            errorMessage: [],
            authFlag: true,
            readOnly: true,
            ID: "",
            errorFlag: "No update",
            address: ""
        }
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.readOnlyHandler = this.readOnlyHandler.bind(this);
        this.pictureChangeHandler = this.pictureChangeHandler.bind(this)
        this.resetPicture = this.resetPicture.bind(this)
        this.uploadImageHandler = this.uploadImageHandler.bind(this)

    }


    componentDidMount() {
        axios.get(address+'/Details/' + sessionStorage.getItem("username"))
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        firstName: response.data.buyerFirstName,
                        lastName: response.data.buyerLastName,
                        email: response.data.buyerEmail,
                        phone: response.data.buyerPhone,
                        image: response.data.buyerImage,
                        ID: response.data.buyerID,
                        address: response.data.buyerAddress
                    })
                    axios.get(address+"/photo/" + response.data.buyerID).then(responses => {
                        console.log(responses.data.buyerImage)
                        this.setState({
                            file: responses.data.buyerImage
                        })
                    })
                }
                else if (response.status === 201) {
                    this.setState({
                        errorFlag: "Some error",
                        errorMessage: response.data
                    })
                }
            });
    }
    uploadImageHandler = (e) => {
        if (this.state.file) {
            e.preventDefault();
            let formData = new FormData();
            formData.append('myImage', this.state.file, this.state.ID);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            axios.post(address+"/upload/photo", formData, config)
                .then((response) => {
                    alert("The file is successfully uploaded");
                }).catch((error) => {
                });
        }

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

        if (this.state.readOnly == false) {
            axios.post(address+'/updateBuyer', data)
                .then(response => {
                    console.log("Status Code : ", response.status);
                    if (response.status === 200) {
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

                    }
                    else if (response.status === 201) {
                        this.setState({
                            errorFlag: "Some error",
                            errorMessage: response.data
                        })
                    }
                });
        }
    }

    render() {
        let redirectVar = null;
        ////
        let image = <div class="img" style={{ paddingTop: '20px' }}><img style={{ width: "80%" }} src="//placehold.it/5000x3000" class="img-circle" /></div>
        let uploadImage = ""
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        let messageDisplay = "";
        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }

        if (this.state.filePreview) {
            image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.filePreview} class="img-circle" onChange={this.pictureChangeHandler} /></div>
            uploadImage = <button onClick={this.uploadImageHandler}>Upload Image</button>

        } else if (this.state.file) {
            image = <div class="img" style={{ paddingBottom: '20px' }}><img style={{ width: "80%" }} src={this.state.file} class="img-circle" onChange={this.pictureChangeHandler} /></div>
        } 
        let createDisplay = (
            <div>

                <div class="row" style={{ paddingBottom: '50px', paddingTop: '50px' }}>
                    <a href="#" onClick={this.readOnlyHandler} class="btn btn-info btn-sm">
                        <span class="glyphicon glyphicon-edit"></span> Edit</a>
                </div>
                <div class="row" style={{ paddingBottom: '10px' }}>
                    <div class="col-md-6" style={{ paddingLeft: '50px' }}>
                        <div class="col-md-6"><input type="file" onChange={this.pictureChangeHandler} name="myImage" class="custom-file-input" /></div>
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
                {messageDisplay}</div>
        )


        return (
            <div>
                {redirectVar}
                <div class="row" >
                    <div class="col-md-4"></div>

                    <div class="col-md-8">   {createDisplay}</div>
                </div>

            </div>
        )
    }
}

export default UpdateDetails;