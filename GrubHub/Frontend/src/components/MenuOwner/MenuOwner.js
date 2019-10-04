import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {address} from '../../constant'



class MenuOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {

            addSection: false,
            addItem: false,
            editItem: false,
            editSection: false,
            deleteItem:false,
            displayItem: true,
            sectionName: "",
            sectionId: "",
            sectionDesc: "",
            errorFlag: "",
            restaurantId: "",
            sectionsPresent: [],
            itemName: "",
            itemDesc: "",
            itemPrice: "",
            itemSection: "",
            itemId: "",
            filePreview:null,
            file:null,
            itemForSection: [],
            itemsPresent: [],
            errorMessage: []
        }
        this.addItemChangeHandler = this.addItemChangeHandler.bind(this);
        this.addSectionChangeHandler = this.addSectionChangeHandler.bind(this);
        this.sectionNameChangeHandler = this.sectionNameChangeHandler.bind(this);
        this.sectionDescChangeHandler = this.sectionDescChangeHandler.bind(this);
        this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
        this.itemDescChangeHandler = this.itemDescChangeHandler.bind(this);
        this.itemPriceChangeHandler = this.itemPriceChangeHandler.bind(this);
        this.itemSectionChangeHandler = this.itemSectionChangeHandler.bind(this);
        this.addItemHandler = this.addItemHandler.bind(this);
        this.fetchItemsforSection = this.fetchItemsforSection.bind(this);
        this.modalCloseSection = this.modalCloseSection.bind(this);
        this.pictureChangeHandler=this.pictureChangeHandler.bind(this)

    }
    pictureChangeHandler =(event)=>{
        if(event.target.files[0]){
            this.setState({
                file: event.target.files[0],
                filePreview: URL.createObjectURL(event.target.files[0])
            });
        }
    }
    promiseGetSections = () => {
        return new Promise((resolve, reject) => {

            axios.get(address+'/section/' + this.state.restaurantId)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            sectionsPresent: response.data
                        })
                        resolve();
                    }
                })

        })
    }
    promiseGetItems = () => {
        return new Promise((resolve, reject) => {

            axios.get(address+'/items/' + this.state.restaurantId)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            itemsPresent: response.data
                        })
                        resolve();
                    }
                })

        })
    }
    promiseGetRestDetails = () => {
        return new Promise((resolve, reject) => {
            axios.get(address+'/DetailsOwner/' + sessionStorage.getItem("username"))
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            restaurantId: response.data.restaurantId
                        })
                        resolve();

                    }
                })
        })
    }
    fetchItemsforSection = (e) => {
        var itemsForThisSection = (this.state.itemsPresent.filter((item) => {
            if (item.SectionId == e.target.value) {
                return item;
            }
        }))
        this.setState({ itemForSection: itemsForThisSection });

    }
    updateItemHandler = (e) => {
        var data = { itemId: this.state.itemId, itemName: this.state.itemName, itemSection: this.state.itemSection, itemPrice: this.state.itemPrice, itemDesc: this.state.itemDesc, restaurantId: this.state.restaurantId }
        axios.put(address+"/items/", data).then(response => {
            if (response.status === 200) {
                this.setState({
                    errorFlag: "Success"
                })
                if(this.state.file && this.state.filePreview){
                    let formData = new FormData();
                    formData.append('myImage',this.state.file,this.state.itemId);
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };
                    axios.post(address+"/upload/ItemPhoto",formData,config)
                        .then((response) => {

                        }).catch((error) => {
                    });
                }
                this.promiseGetItems();
                this.modalClose();
                window.location.reload()
            } else {
                this.setState({
                    errorMessage: response.data,
                    errorFlag: "Some error"
                })
            }
        })
    }

    componentDidMount() {
        this.promiseGetRestDetails().then(() => {
            this.promiseGetSections();
            this.promiseGetItems();
        })
    }
    addItemChangeHandler = (e) => {
        this.setState({ addItem: true, addSection: false, displayItem: false, errorFlag: "" });
        document.getElementById("modalItem").style.display = "block"
    }
    addSectionChangeHandler = (e) => {
        this.setState({ addItem: false, addSection: true, displayItem: false, errorFlag: "" });
        document.getElementById("modalAddSection").style.display = "block"
    }
    displayItemChangeHandler = (e) => {
        this.fetchItemsforSection(e);
        this.setState({ addItem: false, addSection: false, displayItem: true });

    }
    sectionNameChangeHandler = (e) => {
        this.setState({ sectionName: e.target.value });
    }
    sectionDescChangeHandler = (e) => {
        this.setState({ sectionDesc: e.target.value });
    }
    itemNameChangeHandler = (e) => {
        this.setState({ itemName: e.target.value });
    }
    itemDescChangeHandler = (e) => {
        this.setState({ itemDesc: e.target.value });
    }
    itemPriceChangeHandler = (e) => {
        this.setState({ itemPrice: e.target.value });
    }
    itemSectionChangeHandler = (e) => {
        this.setState({ itemSection: e.target.value });
    }
    deleteItemHandler = () => {

        axios.delete(address+"/items/" + this.state.itemId).then(response => {
            if (response.status === 200) {
                this.setState({
                    errorFlag: "Success"
                })
                this.promiseGetItems();
                this.modalClose();
            } else {
                this.setState({
                    errorMessage: response.data,
                    errorFlag: "Some error"
                })
            }
        })
    }
    modalClose = () => {
        document.getElementById("preview").value=null
        document.getElementById("modalItem").style.display = "none";
        
        this.setState({ editItem: false, itemName: "", itemDesc: "", itemPrice: "", itemSection: "", addItem: false, errorFlag: "", errorMessage: [],filePreview:null });
    }
    modalCloseSection = (e) => {

        document.getElementById("modalAddSection").style.display = "none";
        this.setState({ editSection: false, sectionName: "", sectionDesc: "", addSection: false, errorFlag: "", errorMessage: [] });
    }
    modalCloseDeleteSection = (e) => {

        document.getElementById("deleteSectionConfrimation").style.display = "none";
        this.setState({ editSection: false, sectionName: "", sectionDesc: "", addSection: false, errorFlag: "", errorMessage: [] });
    }
    editSectionModal = (e) => {

        document.getElementById("modalAddSection").style.display = "block";
        this.state.sectionsPresent.filter((section) => {
            if (section.menuSectionId == e.target.id) {
                this.setState({ sectionName: section.menuSectionName, editSection: true, sectionId: e.target.id });
                this.setState({ sectionDesc: section.menuSectionDesc });
            }
        })
    }
    editItemModal = (e) => {

        document.getElementById("modalItem").style.display = "block";
        this.state.itemsPresent.filter((item) => {
            if (item.ItemId == e.target.id) {
                this.setState({ itemName: item.ItemName, itemDesc: item.ItemDesc, itemPrice: item.ItemPrice, itemSection: item.SectionId, editItem: true, itemId: item.ItemId ,file:item.itemImage});
            }
        })

    }
    deleteSectionHandler = (e) => {
        this.setState({deleteItem:true});
        document.getElementById("deleteSectionConfrimation").style.display = "block";
        document.getElementById("modalAddSection").style.display = "none";
    }
    updateSectionHandler = (e) => {
        var data = { menuSectionName: this.state.sectionName, menuSectionDesc: this.state.sectionDesc, menuSectionId: this.state.sectionId }
        console.log(data)
        axios.put(address+"/sections/", data).then(response => {
            if (response.status === 200) {
                this.setState({
                    errorFlag: "Success"
                })
                this.promiseGetSections();
                setTimeout(() => {
                    this.modalCloseSection();
                }, 1000);
                
            } else {
                this.setState({
                    errorMessage: response.data,
                    errorFlag: "Some error"
                })
            }
        })
    }
    promiseGetNewItemId =()=>{
        axios.get(address+'/maxItemId/'+this.state.restaurantId).then((response) => {
            console.log(response.data)
            if(this.state.file){
                let formData = new FormData();
                formData.append('myImage',this.state.file,response.data);
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                };
                axios.post(address+"/upload/ItemPhoto",formData,config)
                    .then((response) => {
                        alert("The file is successfully uploaded");
                    }).catch((error) => {
                });
            }

        })
    }
    addItemHandler = (e) => {

        e.preventDefault();
        axios.defaults.withCredentials = true;
        var data = { itemName: this.state.itemName, itemDesc: this.state.itemDesc, itemPrice: this.state.itemPrice, restaurantId: this.state.restaurantId, itemSection: this.state.itemSection }
        axios.post(address+'/item', data).then((response) => {
            if (response.status === 200) {
                this.setState({
                    errorFlag: "Success",
                    errorMessage: []
                })
                if(this.state.file){
                    this.promiseGetNewItemId();
                }
                
                this.promiseGetItems();
                this.promiseGetSections();
                
                setTimeout(() => {
                    this.modalClose();
                    window.location.reload();
                }, 1000);
                
               

            } else if (response.status === 201) {
                this.setState({
                    errorMessage: response.data,
                    errorFlag: "Some error"
                })

            }

        })
    }

    addSectionHandler = (e) => {
        axios.defaults.withCredentials = true;
        var data = { sectionName: this.state.sectionName, sectionDesc: this.state.sectionDesc, restaurantId: this.state.restaurantId }
        axios.post(address+'/section', data).then((response) => {
            if (response.status === 200) {
                this.setState({
                    errorFlag: "Success",
                    errorMessage: []
                })
                this.promiseGetSections();
                setTimeout(() => {
                    this.modalCloseSection();
                }, 1000);
                

            } else if (response.status === 201) {
                this.setState({
                    errorMessage: response.data,
                    errorFlag: "Some error"
                })

            }

        })

    }

    deleteItemPlusSection=(e)=>{
        axios.delete(address+"/sections/" + this.state.sectionId).then(response => {
            if (response.status === 200) {
                this.setState({
                    errorFlag: "Success"
                })
                this.promiseGetSections();

                this.modalCloseDeleteSection();

            } else {
                this.setState({
                    errorMessage: response.data,
                    errorFlag: "Some error"
                })
            }
        })
    }
    render() {



        var redirectVar = "";
        var image="";
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/LoginOwner" />
        }
        var displaySection = (
            this.state.sectionsPresent.map((sections) => {

                return (<li class="list-group-item" style={{ color: "black", fontSize: '16px', background: "#d9d9d9", fontWeight: "bolder" }} value={sections.menuSectionId} onClick={this.displayItemChangeHandler}>{sections.menuSectionName}<span class="badge badge-default badge-pill">{sections.count}</span></li>)
            })
        )
        var itemsToDelete="";
        
        if(this.state.deleteItem==true){
            itemsToDelete=this.state.itemsPresent.map((item)=>{
                if(this.state.sectionId==item.SectionId){
                    return(<li>{item.ItemName}</li>)
                }
            })
        }

        var SectionHeading = "";
        let messageDisplay = "";

        let buttonItem = "";
        let ItemHeading = "";
        var array = [];
        var buttonSection = "";
        if (this.state.editSection == true) {
            buttonSection = (<div class="row">
                <div class="col-md-4"><button type="button" onClick={this.deleteSectionHandler} class="btn btn-danger btn-md">Delete Section</button></div>
                <div class="col-md-4"></div>
                <div class="col-md-4"><button type="button" onClick={this.updateSectionHandler} class="btn btn-success btn-md">Update Section</button></div>
            </div>)
            SectionHeading = "Edit Section"
        } else if (this.state.editSection == false) {
            buttonSection = (<div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-4">
                    <button type="button" onClick={this.addSectionHandler} class="btn btn-success btn-md">Add Section</button>
                </div>
                <div class="col-md-4"></div>
            </div>)

            SectionHeading = "Add Section"
        }

        if (this.state.editItem == true) {
            buttonItem = (<div class="row">
                <div class="col-md-4"><button type="button" onClick={this.deleteItemHandler} class="btn btn-danger btn-md">Delete Item</button></div>
                <div class="col-md-4"></div>
                <div class="col-md-4"><button type="button" onClick={this.updateItemHandler} class="btn btn-success btn-md">Update Item</button></div>
            </div>)
            ItemHeading = "Edit Item"
            if(this.state.filePreview){
                image=(<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name ="myImage" id="preview" class="custom-file-input"/><div class="img" style={{paddingTop:'20px'}}><img style={{ width: "80%" }} src={this.state.filePreview}  class="rounded"/></div></div>)

            }else if(this.state.file){
                image=(<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name ="myImage"id="preview" class="custom-file-input"/><div class="img" style={{paddingTop:'20px'}}><img style={{ width: "80%" }} src={this.state.file}  class="rounded"/></div></div>)

            }else{
                image=(<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name ="myImage"id="preview" class="custom-file-input"/><div class="img" style={{paddingTop:'20px'}}><img style={{ width: "80%" }} src="//placehold.it/500x300"  class="rounded"/></div></div>)

            }
        } else {
            buttonItem = (<div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-4">
                    <button type="button" onClick={this.addItemHandler} class="btn btn-success btn-md">Add Item</button>
                </div>
                <div class="col-md-4"></div>
            </div>)
            ItemHeading = "Add Item"
            if(this.state.filePreview){
                image=(<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name ="myImage" id="preview" class="custom-file-input"/><div class="img" style={{paddingTop:'20px'}}><img style={{ width: "80%" }} src={this.state.filePreview}  class="rounded"/></div></div>)

            }else{
                image=(<div><input type="file" accept="image/*" onChange={this.pictureChangeHandler} name ="myImage"id="preview" class="custom-file-input"/><div class="img" style={{paddingTop:'20px'}}><img style={{ width: "80%" }} src="//placehold.it/500x300"  class="rounded"/></div></div>)

            }
        }

        if (this.state.sectionsPresent.length) {
            this.state.sectionsPresent.map((section) => {
                var flag = 0;
                array.push(<div>
                    <div class="row" style={{ fontSize: "20px", fontWeight: "900" }}>
                    <div class="col-md-1" style={{textAlign:'right'}}><span class="glyphicon glyphicon-pencil" id={section.menuSectionId} onClick={this.editSectionModal}></span> </div>
                        <div class="col-md-11" style={{ alignItems: "right" }}>{section.menuSectionName} </div>
                    </div>
                    <br></br>
                </div>)
                this.state.itemsPresent.filter((item) => {

                    if (item.SectionId == section.menuSectionId) {
                        flag = 1;
                        array.push(
                            <div class="row embossed-heavy" style={{ marginLeft: '10px', marginRight: '200px', marginBottom: '10px', paddingBottom: '10px', fontWeight: 'bold', backgroundColor: 'white',paddingTop:'10px' }}>
                                <span class="border border-dark">
                                    <div class="col-md-5"><img style={{ width: "80%" }} src={item.itemImage}  class="rounded"/></div>
                                    <div class="col-md-5">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600", color: "blue" }}>
                                            <p onClick={this.editItemModal} id={item.ItemId}>{item.ItemName}</p></div>
                                        <div class="row">{item.ItemDesc}</div>
                                    </div>
                                    <div class="col-md-1"></div>
                                    <div class="col-md-1">
                                        <div class="row" style={{ fontSize: "15px", fontWeight: "600" }}>Price</div>
                                        <div class="row">${item.ItemPrice}</div>
                                    </div>

                                    <br></br>
                                </span><br></br></div>)
                    }
                })
                if (flag == 0) {
                    array.push(<div class="row" style={{ marginBottom: '25px', paddingTop: '10px', paddingBottom: '10px', fontSize: "15px", fontWeight: "600", alignItems: "center" }}>
                        <div class="col-md-4"></div><div class="col-md-4">No items here !!!</div><div class="col-md-4"></div>
                    </div>)
                }
            })
        } else {
            array.push(<div class="alert alert-info row" style={{ fontSize: "30px", marginTop: "200px", marginBottom: "200px", paddingLeft: "80px" }}>Welcome New User!! Let's get the menu going!!</div>)
        }

        if (this.state.errorFlag == "Some error") {
            messageDisplay = (this.state.errorMessage.map((error) => {
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        } else if (this.state.errorFlag == "Success") {
            messageDisplay = (<ul class="li alert alert-success">Successfully Updated !!!</ul>);
        }
        var addDropDown = "";

        if (this.state.addItem == true) {
            addDropDown = (
                this.state.sectionsPresent.map((section) => {

                    return (<option value={section.menuSectionId}>{section.menuSectionName}</option>)


                }))
        } else if (this.state.editItem == true) {
            addDropDown = (
                this.state.sectionsPresent.map((section) => {
                    if (section.menuSectionId == this.state.itemSection) {
                        return (<option value={section.menuSectionId} selected>{section.menuSectionName}</option>)
                    } else {
                        return (<option value={section.menuSectionId}>{section.menuSectionName}</option>)
                    }

                }))
        }
        
        return (
            <div>
                {redirectVar}
                <div class="row">
                    <div class="col-md-12"> <p align="center" style={{ fontSize: '50px', color: 'crimson', paddingLeft: '20px', paddingRight: '20px', }}>{sessionStorage.getItem("RestaurantName")}</p></div>
                </div>

                <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <button type="button" onClick={this.addItemChangeHandler} style={{ marginTop: '20px' }} class="btn btn-info btn-md col-sm-3">Add New Item</button>
                    </div>
                </div>
                <br></br>
                <div class="row ">
                    <div class="col-md-2" style={{ marginTop: '0px', paddingLeft: '20px', paddingRight: '0px' }}>
                        <ul class="list-group">
                            <p style={{ color: "#0033cc", fontWeight: "bolder" }} onClick={this.addSectionChangeHandler}>ADD NEW SECTION</p>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        {array}
                    </div>
                    <div class="col-md-4"></div>
                </div>

                <div class="row">
                    <div class="col-sm-5"></div>
                    <div class="col-sm-5" style={{ marginTop: '0px' }}></div>
                </div>
                <div class="modal" id="modalItem" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{ItemHeading}</h4></div>
                                    <div class="col-md-1"><button type="button" id="close" data-dismiss="modal" onClick={this.modalClose}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body">
                                <div class="row" style={{ paddingLeft: "25px" }}>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="row" style={{ paddingBottom: "5px" }}>Item</div>
                                            <div class="row signup" style={{ paddingBottom: "15px" }}><input value={this.state.itemName} onChange={this.itemNameChangeHandler} type="text" class="form-control" name="itemName" /></div>
                                        </div>
                                        <div class="row">
                                            <div class="row">Description</div>
                                            <div class="row signup" style={{ paddingBottom: "15px" }}><input value={this.state.itemDesc} onChange={this.itemDescChangeHandler} type="text" class="form-control" name="itemDesc" /></div>
                                        </div>
                                    {/* </div> */}
                                    {/* <div class="col-md-6">{image}</div> */}
                                {/* </div> */}
                                {/* <div class="row" style={{ paddingLeft: "25px" }}> */}
                                <div class="row">
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Sections
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <select onChange={this.itemSectionChangeHandler}>
                                            <option value={0}>select</option>
                                            {addDropDown}
                                        </select>
                                    </div>
                                    </div>
                                </div>


                                <div class="col-md-6">{image}</div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Base Price
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input value={this.state.itemPrice} onChange={this.itemPriceChangeHandler} type="number" class="form-control" name="lastName" />
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                {buttonItem}
                                <div class="row" style={{ marginTop: "20px" }}>
                                    {messageDisplay}

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal" id="modalAddSection" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-6"><h4 class="modal-title">{SectionHeading}</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseSection}>&times;</button></div>
                                </div>


                            </div>

                            <div class="modal-body">
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Sections
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input onChange={this.sectionNameChangeHandler} type="text" class="form-control signup" name="sectionName" value={this.state.sectionName} />
                                    </div>
                                </div>
                                <div class="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                                    <div class="row" style={{ paddingBottom: "5px" }}>
                                        Description
                                </div>
                                    <div class="row" style={{ paddingBottom: "15px" }}>
                                        <input onChange={this.sectionDescChangeHandler} type="text" class="form-control" name="sectionDesc" value={this.state.sectionDesc} />                                </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                {buttonSection}
                                <div class="row">
                                    {messageDisplay}

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal modal-backdrop" id="deleteSectionConfrimation" >
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <div class="row">

                                    <div class="col-md-11"><h4 class="modal-title">Are you sure you want to delete the section? <br></br>
                                        The items below will be deleted along with the section</h4></div>
                                    <div class="col-md-1"><button type="button" id="closeSection" data-dismiss="modal" onClick={this.modalCloseDeleteSection}>&times;</button></div>
                                </div>

                            </div>

                            <div class="modal-body">
{itemsToDelete}

                            </div>

                            <div class="modal-footer">
                                <div class="row">
                                    <div class="col-md-2"></div>
                                    <div class="col-md-5"><button type="button" onClick={this.deleteItemPlusSection} class="btn btn-danger btn-md">Delete Section</button></div>
                                    <div class="col-md-4"></div>
                                </div>
                                <div class="row">
                                    {messageDisplay}

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default MenuOwner;