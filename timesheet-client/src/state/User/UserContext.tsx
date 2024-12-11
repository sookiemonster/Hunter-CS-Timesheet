import React, { useState, useCallback, PropsWithChildren, useEffect } from "react";
import User from "./User";

export const UserContext = React.createContext<any>(null);

export function UserProvider(props: PropsWithChildren) {
    const [email, setEmail] = useState(sessionStorage.getItem('email') || "");
    const [user, setUser] = useState({});
    const [loginStatus, setloginStatus] = useState(sessionStorage.getItem('loginStatus') || "");
    const [role, setRole] = useState(sessionStorage.getItem('role') || "");

    const isLoggedIn = () => { return loginStatus; }
    const isAdmin = () => { return role === 'admin' }

    const logout = () => {
        setEmail("");
        setUser({});
        setloginStatus("");
        setRole("");
        sessionStorage.setItem('email', "");
        sessionStorage.setItem('loginStatus', "");
        sessionStorage.setItem('role', "");
    }

    console.log("USER", user)

    useEffect(() => {
        sessionStorage.setItem('email', email);
    }, [email])

    useEffect(() => {
        sessionStorage.setItem('loginStatus', loginStatus || "");
    }, [loginStatus])

    useEffect(() => {
        sessionStorage.setItem('role', role);
    }, [role])

    const value = { logout, isAdmin, email, setEmail, user, setUser, loginStatus, setloginStatus, role, setRole };
    return <UserContext.Provider value={value}>
        {props.children}
    </UserContext.Provider>
}