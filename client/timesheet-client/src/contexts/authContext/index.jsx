/*File takes care of two things:
  1. creat an authentication context which incapsulates all the childrens
  2. create a use authentication hook which can use in different component to get to know about the different authenticate estate? paremeters 

*/
import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {onAuthStateChanged} from "firebase/auth";
/*
  Authentication Context 
    is a shared state that allows components in React application to access and modify the users authentication 
    status (logged in, logged out, user details)

    How it Works:
      the context stores the authentication state, such as the use object, access tokens, and a login/logout function
      components can "subscribe" to this context to get or update authentication information without passing props down manually (send data from a parent component to its child)
*/
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/*
  Authentication Provider Component
    wraps the application and provides the authenication context to all components in the component tree
    initializes the context and makes it available throughout your app
    typically contains logic for persisting authentication state (checking tokens in localstorage or cookies)
*/
export function AuthProvider({children}){
  //state var 1 current user
  const[currentUser, setCurrentUser] = useState(null);
  //state var 2 is user is logged in set to true else false 
  const[userLoggedIn, setUserLoggedIn] = useState(false);
  //state var 3 true means currently trying to find out current authentication state
  const[loading, setLoading] = useState(true);

  /*subscribe to auth state change event so whenever the authentication state is changed 
    such as user is logging in or out then we went to subscribe to those event changes by 
    simply listening to them so (import { auth }). Doing this by a use effect hook 
  */
  
    /* 
      Use Effect Hook 
      used to handle side effects of functional components, refering to any operation outside 
      of the scope of React components render ex fetching data from API
    */
    useEffect(() =>{ //call back function as argument and empty dependencies area? b/c only need it for first time
        //to unsubscribe 
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user){
      if(user){ //a valid value
        setCurrentUser({...user});
        setUserLoggedIn(true);
      }
      else{ //if user is logged out
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    }

    /*
      Create value object which exposes current user and if its logged in or not and also 
      loading state if hook is currently loading user or not 
    */
   const value = {
    currentUser,
    userLoggedIn,
    loading
   }
   /*
   return auth context provider with the value prop 
   Provider componenet makes the authntication state available to the rest of the app
   children allow other components to access the provided data, only render if loading is false meaning auth process complete 
   */
   return(
      <AuthContext.Provider value={value}>
        {!loading && children} 
      </AuthContext.Provider>
   )

   /*
  */
}