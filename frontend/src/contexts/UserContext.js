import React, { createContext, Component } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext();

class UserContextProvider extends Component {
    state = {
        user: null,
        isOnline: false,
        loading: true // Add loading state
    }

    // Lifecycle method to set up the Firebase auth listener
    componentDidMount() {
        // Listen for changes in authentication state
        this.unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // If the user is logged in, set the user and mark isOnline as true
                this.setState({
                    user: currentUser,
                    isOnline: true,
                    loading: false // Mark loading as false after user is set
                });
                console.log(currentUser.email + " is logged in")
            } else {
                // If no user is logged in, reset the state and mark loading as false
                this.setState({
                    user: null,
                    isOnline: false,
                    loading: false // Mark loading as false after checking
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
            <UserContext.Provider value={{...this.state}}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserContextProvider;
