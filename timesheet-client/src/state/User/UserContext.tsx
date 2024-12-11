import React, { useState, useCallback, PropsWithChildren } from "react";
import User from "./User";

export const UserContext = React.createContext<any>(null);

export function UserProvider(props: PropsWithChildren) {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState({});
    const [loginStatus, setloginStatus] = useState(null);
    const [role, setRole] = useState("");

    const isLoggedIn = () => { return loginStatus; }
    const isAdmin = () => { return role === 'admin' }

    const value = { isAdmin, email, setEmail, user, setUser, loginStatus, setloginStatus, role, setRole };
    return <UserContext.Provider value={value}>
        {props.children}
    </UserContext.Provider>
}