
/*
For authentication 
*/
import {auth} from "../config/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import { useState } from "react";

export const Auth = () =>{
  //to have access to email and password user proves use useState 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //create  function that will be called everytime user clicks button 
  const signIn = async () =>{
    //must have access to email and password user provides 
    try{
      await createUserWithEmailAndPassword(auth, email, password)
    }catch(err){
      console.error(err)
    }
   

  };
  return(
    <div>
      <input placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)} //set state equal to value of input 
      />
      <input placeholder="Password.."
            onChange={(e) => setPassword(e.target.value)} //set state equal to value of input 
      />
      <button onClick={signIn}> Sign In </button>
    </div>
  )
};