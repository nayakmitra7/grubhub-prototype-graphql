import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import signup from './signup/signup';
import UpdateDetails from './UpdateDetails/UpdateDetails';
import Navbar from './LandingPage/Navbar';
import UpdateDetailsOwner from './UpdateDetailsOwner/UpdateDetailsOwner';
import LoginOwner from './LoginOwner/LoginOwner';
import SignUpOwner from './SignUpOwner/SignUpOwner';
import MenuOwner from './MenuOwner/MenuOwner';
import HomeOwner from './HomeOwner/HomeOwner';
import Delete from './Delete/Delete';
import HomePage from './HomePage/HomePage'
import SearchPage from './SearchPage/SearchPage'
import DetailsPage from './DetailsPage/DetailsPage'

class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={signup}/>
                <Route path="/delete" component={Delete}/>
                <Route path="/UpdateDetails" component={UpdateDetails}/>
                <Route path="/UpdateDetailsOwner" component={UpdateDetailsOwner}/>
                <Route path="/LoginOwner" component={LoginOwner}/>
                <Route path="/SignUpOwner" component={SignUpOwner}/>
                <Route path="/MenuOwner" component={MenuOwner}/>
                <Route path="/HomeOwner" component={HomeOwner}/>
                <Route path="/Delete" component={Delete}/>
                <Route path="/HomePage" component={HomePage}/>
                <Route path="/SearchPage" component={SearchPage}/>
                <Route path="/DetailsPage" component={DetailsPage}/>

            </div>
        )
    }
}
//Export The Main Component
export default Main;

