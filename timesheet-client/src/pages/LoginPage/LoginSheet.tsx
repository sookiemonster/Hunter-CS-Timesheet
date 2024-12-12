//@ts-nocheck
import {auth, provider, db} from '../../config/firebase'
import { signInWithPopup, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useContext } from "react";
import { UserContext } from '../../state/User';
import { doSignInWithEmailAndPassword} from '../../config/auth';
import { query, where, getDocs, collection } from 'firebase/firestore';

import { Button, PasswordInput, Space, Stack, Text, TextInput } from '@mantine/core';
import './styles/styles.css';

export const Login = () =>{
  const { email, setEmail, loginStatus, setloginStatus, setUser, user, role, setRole } = useContext(UserContext);
  const navigate = useNavigate(); //allows to navigate from one page to another
  const [password, setPassword] = useState('');

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
      console.log("error logging in");
    

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
  return (
    <div id='login-sheet-container'>
      <Text size='xl' ta='left' fw={700} c="softpurple.3">Login</Text>
      <form onSubmit={signIn}>
      <div id="login-sheet-form">
        <TextInput 
          variant="filled"
          description="e.g. john.doe14@myhunter.cuny.edu"
          label="Email"
          
          placeholder='Enter your Hunter email'
          autoComplete='email'
          
          withAsterisk
          required
          value={email} onChange={(e) => { setEmail(e.target.value) }}
          />
        <Space h='xs' />
        <PasswordInput 
          variant="filled"
          label="Password"
          placeholder='Enter your password'
          autoComplete='password'
          required
          value={password} onChange={(e) => { setPassword(e.target.value) }}
          
          />

        <small style={{ textAlign: 'right' }}>
        <Space h='md' />
        <Link to="/forgot-password">Forgot your password?</Link>
        </small>
        <Button className='login-button' color='softpurple.4' type = "submit"> Login</Button>
        </div>
      </form>
    </div>
  )
};