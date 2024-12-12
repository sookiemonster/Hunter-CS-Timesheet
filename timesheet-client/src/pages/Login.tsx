//@ts-nocheck
import {auth, provider, db} from '../config/firebase'
import { signInWithPopup, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useContext } from "react";
import { AppContext } from "../App";
import { doSignInWithEmailAndPassword} from '../config/auth';
import { query, where, getDocs, collection } from 'firebase/firestore';

export const Login = () =>{
  const navigate = useNavigate(); //allows to navigate from one page to another
  const {email} = useContext(AppContext);
  const {setEmail} = useContext(AppContext);
  const [password, setPassword] = useState('');
  const {loginStatus} = useContext(AppContext);
  const {setloginStatus} = useContext(AppContext);
  const {setUser} = useContext(AppContext);
  const {user} = useContext(AppContext);
  const {role} = useContext(AppContext);
  const {setRole} = useContext(AppContext);

  //-----fetching user role------//
  const fetchUserRole = async (uid) => {
    try {
      const q = query(collection(db, "user"), where("id", "==", uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          console.log("User role:", doc.data().role);
          setRole(doc.data().role);
        });
      } else {
        console.error("No document found for this UID.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  //---makes sure login status is updated before navigating---//
  useEffect(() => {
    if (loginStatus) {
      console.log(loginStatus);
      console.log("user: ", user?.email);
      console.log("role: ", role);
      console.log("Login status updated to true, and user updated navigating to timesheet...");
      navigate('/timesheet');
    }
  }, [loginStatus, navigate, user,role]);

  //----sign in with registered email and password----//
  const signIn = async (e) => {
    e.preventDefault()
    console.log("sign in function called");
    try{
      const result = await doSignInWithEmailAndPassword(email, password);
      const user = result.user;

      console.log("user found!");
      //check if user verified their email if so redirect to timesheet page 
      if(user.emailVerified){
        setloginStatus(true);
        setUser(user);
        console.log("user is verified");

        //checking user role 
        fetchUserRole(user.uid);

        //console.log("login status:", loginStatus)
       // navigate('/timesheet');
      }
      else{
        alert("Please verify your email. A link has been sent. Then try logging in again")
        await sendEmailVerification(user);
        console.log("email verification sent");

      }
      

    }catch(error){
      console.log("error logging in, user not registered in system");
    

    }
    
        
       
        // doSendEmailVerification()
  
}
  
  //---sign in with google method---//
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      //const user = result.user;
      //console.log("verification status: ", user.emailVerified);
      //sendEmailVerification(result.user);

      
      navigate('/');
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert("Error logging in. Please make sure password and email is correct or click option to reset password")
    }
  };
///onSubmit={(e) => { e.preventDefault(); register(); }}
  return <div>
  <p>Sign in with your registered email and password</p>
  <form  onSubmit={signIn}>
      <div>
      <label>
        Email
        </label>
          <input
            type="email"
            autoComplete='email'
            required
            value={email} onChange={(e) => { setEmail(e.target.value) }}
            />
      </div>
      <div>
          <label>
              Password
          </label>
          <input
              type="password"
              autoComplete='new-password'
              required
              value={password} onChange={(e) => { setPassword(e.target.value) }}
            />
      </div>

      <button type = "submit"> Login</button>
    </form>
    
    <Link to="/forgot-password">Forgot Password?</Link>
    <p>Sign In With Google</p>
    <button onClick={signInWithGoogle}>Sign in With Google</button>

  </div>;
};