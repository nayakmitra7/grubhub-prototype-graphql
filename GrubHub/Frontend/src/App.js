import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import Navabar from './components/LandingPage/Navbar';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql'
});
//App Component
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
      <BrowserRouter>
        <div>
          <Navabar></Navabar>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
        </div>
      </BrowserRouter>
     </ApolloProvider>
    );
  }
}
//Export the App component so that it can be used in index.js
export default App;
