//@ts-nocheck
import {auth, provider, db} from '../config/firebase'
import {  sendEmailVerification, } from 'firebase/auth';
import { setDoc, addDoc, collection } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from "react";
import { AppContext } from "../App";
import { doCreateUserWithEmailAndPassword } from '../config/auth';

export const Register = () =>{
  const navigate = useNavigate(); //allows to navigate from one page to another
  const {email} = useContext(AppContext);
  const {setEmail} = useContext(AppContext);
  const [password, setPassword] = useState('')
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const roleRef = collection(db, "user"); //reference to user collection

  const register = async (e) => {
    e.preventDefault()
    console.log("register function called")
    try{
      const result = await doCreateUserWithEmailAndPassword(email, password);
      const user = result.user

      //register as ta
      
      await addDoc(roleRef, {
        email: user.email,
        id: user.uid,
        role: "ta"
      })
      

     

      console.log("verification status: ", user.emailVerified)
      if(!user.emailVerified){
        await sendEmailVerification(user);
        console.log("email verification sent");
        setRegistrationStatus(true);
      }
    }catch(error){
      console.log("error registering and sending link");
      setRegistrationStatus(false);
    }
     
  } 
  return (
    <div>
      <form  onSubmit={register}>
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

      <button type = "submit"> Register</button>
    </form>
    {registrationStatus === false && <p>Error registering user</p>}
    {registrationStatus && <p>Successfully registered user and email verification sent!</p>}

    </div>
  )

}