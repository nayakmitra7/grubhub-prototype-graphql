import React, { Component } from 'react';
import '../../../App.css';


class ReviewPage extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        var redirectVar = "";

        let displayMessage = null;

        return (
            <div>
                {displayMessage}

                <div class="container">
                    <div class="login-form">
                        <div class="main-div" style={{width:"1400px",maxWidth:"100%"}}>
                            <div style={{fontSize:'30px'}}>Your order has been succesfully Placed. You will soon be receving your order at the address below: </div>
                            <div style={{fontSize:'20px'}}><br></br>{sessionStorage.getItem("Address")}</div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
//export Login Component
export default ReviewPage;