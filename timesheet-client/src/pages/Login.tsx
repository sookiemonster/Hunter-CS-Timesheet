//@ts-nocheck
import {auth, provider} from '../config/firebase'
import { signInWithPopup, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from "react";
import { AppContext } from "../App";
import { doCreateUserWithEmailAndPassword } from '../config/auth';

export const Login = () =>{
  const navigate = useNavigate(); //allows to navigate from one page to another
  const {email} = useContext(AppContext);
  const {setEmail} = useContext(AppContext);
  const [password, setPassword] = useState('')
 
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
    }
  };
///onSubmit={(e) => { e.preventDefault(); register(); }}
  return <div>
    
    <p>Sign In With Google</p>
    <button onClick={signInWithGoogle}>Sign in With Google</button>

  </div>;
};