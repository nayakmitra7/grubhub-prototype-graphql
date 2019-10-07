import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Buyer/Login/Login';
import signup from './Buyer/signup/signup';
import UpdateDetails from './Buyer/UpdateDetails/UpdateDetails';
import UpdateDetailsOwner from './Owner/UpdateDetailsOwner/UpdateDetailsOwner';
import LoginOwner from './Owner/LoginOwner/LoginOwner';
import SignUpOwner from './Owner/SignUpOwner/SignUpOwner';
import MenuOwner from './Owner/MenuOwner/MenuOwner';
import HomeOwner from './Owner/HomeOwner/HomeOwner';
import HomePage from './Buyer/HomePage/HomePage'
import SearchPage from './Buyer/SearchPage/SearchPage'
import DetailsPage from './Buyer/DetailsPage/DetailsPage'
import ReviewPage from './Buyer/ReviewPage/ReviewPage'
import UpcomingOrder from './Buyer/UpcomingOrder/UpcomingOrder'
import PastOrder from './Buyer/PastOrder/PastOrder'
import PastOrderOwner from './Owner/PastOrderOwner/PastOrderOwner'
import SetUpOwner from './Owner/SetUpOwner/SetUpOwner'

class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={signup}/>
                <Route path="/UpdateDetails" component={UpdateDetails}/>
                <Route path="/UpdateDetailsOwner" component={UpdateDetailsOwner}/>
                <Route path="/LoginOwner" component={LoginOwner}/>
                <Route path="/SignUpOwner" component={SignUpOwner}/>
                <Route path="/MenuOwner" component={MenuOwner}/>
                <Route path="/HomeOwner" component={HomeOwner}/>
                <Route path="/HomePage" component={HomePage}/>
                <Route path="/SearchPage" component={SearchPage}/>
                <Route path="/DetailsPage" component={DetailsPage}/>
                <Route path="/ReviewPage" component={ReviewPage}/>
                <Route path="/UpcomingOrder" component={UpcomingOrder}/>
                <Route path="/PastOrder" component={PastOrder}/>
                <Route path="/PastOrderOwner" component={PastOrderOwner}/>
                <Route path="/SetUpOwner" component={SetUpOwner}/>

                
            </div>
        )
    }
}
//Export The Main Component
export default Main;

