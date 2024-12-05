//@ts-nocheck
import {auth, provider} from '../config/firebase'
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export const Login = () =>{
  const navigate = useNavigate(); //allows to navigate from one page to another 
  const signInWithGoogle = async() =>{
   
    //return a promise 
    const result = await signInWithPopup(auth, provider); 
    console.log(result);
    navigate('/Home');
  };

  return <div>
    <p>Sign In With Google</p>
    <button onClick={signInWithGoogle}>Sign in With Google</button>
  </div>;
};