import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';


class Home extends Component {
    constructor(){
        super();
        this.state = {  
            sign : "",
            result: "",
            firstVal :"",
            secondVal : "",
            errorFlag : false,
            errorMessage:[]
        }
        this.addHandler = this.addHandler.bind(this);
        this.subtractHandler = this.subtractHandler.bind(this);
        this.divideHandler = this.divideHandler.bind(this);
        this.multiplyHandler = this.multiplyHandler.bind(this);
        this.submitHandler =this.submitHandler.bind(this);
        this.secondValHandler = this.secondValHandler.bind(this);
        this.firstValHandler = this.firstValHandler.bind(this);
        this.shiftHandler = this.shiftHandler.bind(this);
    }  
    //get the books data from backend  
    componentDidMount(){
        this.setState({
            firstVal:"0",
            secondVal:"0"

        })
    }
    
    addHandler =(e)=>{
        this.setState({
            sign : "+"
        })
    }
    subtractHandler =(e)=>{
        this.setState({
            sign : "-"
        })
    }
    multiplyHandler =(e)=>{
        this.setState({
            sign : "*"
        })
    }
    divideHandler =(e)=>{
        this.setState({
            sign : "/"
        })
    }
    firstValHandler = (e) =>{
        this.setState({
            firstVal : e.target.value
        })
    }
    secondValHandler = (e) =>{
        this.setState({
            secondVal : e.target.value
        })
    }
    submitHandler=(e) =>{
        var data = {sign:this.state.sign, firstVal :this.state.firstVal, secondVal:this.state.secondVal}
        axios.post('http://localhost:3001/home',data)
                 .then((response) => {
                     if(response.status===201){
                        this.setState({
                            errorMessage : response.data,
                            errorFlag:true,
                            result:""
                        });
                     }else{
                        this.setState({
                            result : response.data,
                            errorMessage : [],
                            errorFlag:false
                        });
                     }
                 
             });
    }
    reset = (e) =>{
        this.setState({
            firstVal:"0",
            secondVal:"0",
            sign:"",
            errorFlag:false,
            errorMessage:[],
            result:""
        });
    }
    shiftHandler = (e) =>{
        this.setState({
            firstVal: this.state.result,
            secondVal:"",
            sign:"",
            errorFlag:false,
            errorMessage:[],
            result:""
        });
    }
    render(){
        let messageDisplay="";
        if(this.state.errorFlag==true){
            messageDisplay = ( this.state.errorMessage.map( (error) =>{
                return (<li class=" li alert-danger">{error.msg}</li>)
            }))
        }else{
            messageDisplay="";
        }
        return(
            <div class="container">
                  <p class="page-header">Calculator</p>
            <div class="login-form">
                <div class="main-div">
                <table>
                            <tr>
                        
                            <td><button type="button" class="btn btn-success" onClick={this.addHandler}>Add</button></td>
                            <td><button type="button" class="btn btn-danger" onClick={this.subtractHandler}>Subtract</button></td>
                            <td><button type="button" class="btn btn-info" onClick={this.multiplyHandler}>Multiply</button></td>
                            <td><button type="button" class="btn btn-warning" onClick={this.divideHandler}>Divide</button></td>
                            </tr>
                            </table>
                            <br></br>
                        <table class="inputTable">
                            <br></br>
                            <tr>
                                <td><input type="number" onChange={this.firstValHandler} value={this.state.firstVal}></input></td>
                            </tr>
                            <tr>
                                <td><span class="sign">{this.state.sign}</span></td>
                            </tr>
                            <tr>
                                <td><input type="number" onChange={this.secondValHandler} value={this.state.secondVal}></input></td>
                            </tr>
                            <br></br><br></br>
                            <tr>
                            <button type="button" class="btn btn-dark" onClick={this.submitHandler}>=</button>
                            </tr>
                            <br></br><br></br>
                          </table>
                         <table>
                         <tr>
                            <td><input type="number" class="result" value={this.state.result}  readOnly></input></td>
                            <td><input type="button" value="Reset" class="reset" onClick={this.reset}></input></td>
                            <td><input type="button" value="Shift" class="reset" onClick={this.shiftHandler}></input></td>

                            </tr>
                         </table>
                </div>
  {messageDisplay}
            </div>
        </div>
        )
    }
}
//export Home Component
export default Home;