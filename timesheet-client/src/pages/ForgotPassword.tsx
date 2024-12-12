//@ts-nocheck
import { useState } from "react";
import { doResetPassword } from "../config/auth";
import { Link } from "react-router-dom";

export const ForgotPassword = () =>{
  const [email, setEmail] = useState("");

  const resetPassword = async (e) =>{
    e.preventDefault();
    try{
      await doResetPassword(email);
      alert("If the email exist in our system an email was sent to reset your password");

    }catch(error){
      console.log("error sending reset password email");
    }
  }

  return (
    <div>
      If you forgot your password please enter your email and if your account exist we'll send an email to reset
      <form onSubmit={resetPassword}>
        <label>
          Email
        </label>
        <input
          type = "email"
          autoComplete="email"
          required
          value = {email} onChange={(e) => {setEmail((e.target.value))}} 
          />
          <button type = "submit"> Reset Password</button>
      </form>
      <Link to="/">Back To Login</Link>
    </div>
  )
};