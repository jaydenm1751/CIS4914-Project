import React, { createContext, Component } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext();

class UserContextProvider extends Component {
  state = {
    user: null,
    loading: true 
  }

  // Lifecycle method to set up the Firebase auth listener
  componentDidMount() {
    // Listen for changes in authentication state
    this.unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        this.setState({
          user: currentUser,
          loading: false // Mark
        });
      } else {
        // If no user is logged in, reset the state and mark loading as false
        this.setState({
          user: null,
          isOnline: false,
          loading: false 
        });
      }
    });
  }

  // Clean up the listener when the component unmounts
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <UserContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
